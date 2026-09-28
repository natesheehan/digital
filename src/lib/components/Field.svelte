<script lang="ts">
	import { onMount } from 'svelte';
	import { profile, publications, software } from '$lib/data';

	/**
	 * The page background: a hex dump of this site's own data, pinned to the document so it
	 * scrolls with the page. Bytes flicker as they are "rewritten", and the row under the cursor
	 * is selected like in a hex editor. In the printout theme it sits on green-bar tractor-feed paper.
	 */
	let canvas: HTMLCanvasElement;

	const text = [
		`${profile.name} :: ${profile.role} :: ${profile.chair} :: ${profile.institution}`,
		...publications.map((p) => `${p.year} ${p.title} // ${p.venue}${p.doi ? ' doi:' + p.doi : ''}`),
		...software.map((s) => `${s.name}: ${s.summary}`)
	].join('  ::  ');
	const bytes = new TextEncoder().encode(text);

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const ROW = 18;
		const FONT = '11px "Space Mono", ui-monospace, monospace';
		const BLOCK_GAP = 36;
		const hex = (n: number, w: number) => n.toString(16).padStart(w, '0');

		let W = 0;
		let H = 0;
		let dpr = 1;
		let cw = 6.6;
		let BW = 560;
		let ink = '61 255 139';
		let paper = false;
		let scroll = -1;
		let dirty = true;
		let raf = 0;
		let frame = 0;
		const ptr = { x: -1, y: -1 };
		let muts: { row: number; b: number; col: number; val: number; until: number }[] = [];
		let lastMut = 0;

		function measure() {
			ctx!.font = FONT;
			cw = ctx!.measureText('0').width || 6.6;
			BW = Math.ceil(cw * 78) + BLOCK_GAP;
		}

		function resize() {
			dpr = Math.min(2, window.devicePixelRatio || 1);
			W = window.innerWidth;
			H = window.innerHeight;
			canvas.width = W * dpr;
			canvas.height = H * dpr;
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
			measure();
			dirty = true;
		}

		function readTheme() {
			const cs = getComputedStyle(document.documentElement);
			const nextInk = cs.getPropertyValue('--net-ink').trim() || ink;
			const nextPaper = cs.getPropertyValue('--paper').trim() === '1';
			if (nextInk !== ink || nextPaper !== paper) {
				ink = nextInk;
				paper = nextPaper;
				dirty = true;
			}
		}
		const c = (a: number) => `rgb(${ink} / ${a})`;

		/** where the dump starts horizontally, so it is centred on the page */
		const originX = () => {
			const n = Math.max(1, Math.floor(W / BW));
			return Math.round((W - n * BW + BLOCK_GAP) / 2);
		};

		const byteAt = (row: number, b: number, col: number) => bytes[(row * 16 + col + b * 7919) % bytes.length];

		function rowStrings(row: number, b: number) {
			let h1 = '';
			let h2 = '';
			let asc = '';
			for (let col = 0; col < 16; col++) {
				const m = muts.find((q) => q.row === row && q.b === b && q.col === col);
				const v = m ? m.val : byteAt(row, b, col);
				(col < 8 ? (h1 += hex(v, 2) + ' ') : (h2 += hex(v, 2) + ' '));
				asc += v >= 32 && v < 127 ? String.fromCharCode(v) : '.';
			}
			return `${hex(row * 16 + b * 0x10000, 8)}  ${h1} ${h2} |${asc}|`;
		}

		/** x offset (in chars) of a byte's hex pair within a row string */
		const hexCol = (col: number) => 10 + col * 3 + (col >= 8 ? 1 : 0);

		function draw(now: number) {
			ctx!.clearRect(0, 0, W, H);
			const first = Math.floor(scroll / ROW) - 1;
			const last = Math.ceil((scroll + H) / ROW) + 1;

			// ---- printout: green bars and tractor-feed margins ----
			if (paper) {
				ctx!.fillStyle = 'rgb(46 160 90 / 0.09)';
				for (let r = first; r <= last; r++) {
					if (Math.floor(r / 3) % 2 === 0) ctx!.fillRect(0, r * ROW - scroll, W, ROW);
				}
				ctx!.strokeStyle = c(0.18);
				ctx!.lineWidth = 1;
				ctx!.setLineDash([2, 3]);
				ctx!.beginPath();
				ctx!.moveTo(30.5, 0);
				ctx!.lineTo(30.5, H);
				ctx!.moveTo(W - 30.5, 0);
				ctx!.lineTo(W - 30.5, H);
				ctx!.stroke();
				ctx!.setLineDash([]);
				ctx!.beginPath();
				const HOLE = 36;
				for (let y = -(scroll % HOLE) + HOLE / 2; y < H + HOLE; y += HOLE) {
					ctx!.moveTo(20, y);
					ctx!.arc(15, y, 5, 0, Math.PI * 2);
					ctx!.moveTo(W - 10, y);
					ctx!.arc(W - 15, y, 5, 0, Math.PI * 2);
				}
				ctx!.stroke();
			}

			// ---- the dump ----
			ctx!.font = FONT;
			ctx!.textBaseline = 'middle';
			const x0 = originX();
			const blocks = Math.max(1, Math.ceil((W - x0) / BW));
			const base = paper ? 0.07 : 0.075;
			const selRow = ptr.y >= 0 ? Math.floor((ptr.y + scroll) / ROW) : -1;
			const selB = ptr.x >= 0 ? Math.floor((ptr.x - x0) / BW) : -1;

			for (let r = Math.max(0, first); r <= last; r++) {
				const y = r * ROW - scroll + ROW / 2;
				for (let b = 0; b < blocks; b++) {
					const x = x0 + b * BW;
					const sel = r === selRow && b === selB;
					ctx!.fillStyle = c(sel ? 0.32 : base);
					ctx!.fillText(rowStrings(r, b), x, y);
				}
			}

			// bytes being rewritten stand out briefly
			for (const m of muts) {
				const y = m.row * ROW - scroll + ROW / 2;
				const x = x0 + m.b * BW + hexCol(m.col) * cw;
				const k = Math.max(0, (m.until - now) / 700);
				ctx!.fillStyle = c(0.12 + 0.3 * k);
				ctx!.fillRect(x - 1, y - ROW / 2 + 3, cw * 2 + 2, ROW - 6);
			}

			// hex-editor caret on the byte under the cursor
			if (selRow >= 0 && selB >= 0 && selB < blocks) {
				const x = x0 + selB * BW;
				const rel = (ptr.x - x) / cw - 10;
				if (rel >= 0 && rel < 49) {
					const col = Math.max(0, Math.min(15, rel < 24 ? Math.floor(rel / 3) : Math.floor((rel - 1) / 3)));
					const y = selRow * ROW - scroll;
					if (reduce || Math.floor(now / 530) % 2 === 0) {
						ctx!.fillStyle = c(0.55);
						ctx!.fillRect(x + hexCol(col) * cw - 1, y + 3, cw * 2 + 2, ROW - 6);
						ctx!.fillRect(x + (60 + col) * cw, y + 3, cw, ROW - 6);
					}
					ctx!.fillStyle = c(0.5);
					ctx!.fillText(`← 0x${hex(byteAt(selRow, selB, col), 2)} @ ${hex(selRow * 16 + col + selB * 0x10000, 8)}`, x + 78 * cw, y + ROW / 2);
				}
			}
		}

		function loop(now: number) {
			frame++;
			if (frame % 30 === 1) readTheme();
			const s = window.scrollY;
			if (s !== scroll) {
				scroll = s;
				dirty = true;
			}
			// rewrite a random visible byte every so often
			if (now - lastMut > 140) {
				lastMut = now;
				muts = muts.filter((m) => m.until > now);
				const x0 = originX();
				muts.push({
					row: Math.floor((scroll + Math.random() * H) / ROW),
					b: Math.floor(Math.random() * Math.max(1, Math.ceil((W - x0) / BW))),
					col: Math.floor(Math.random() * 16),
					val: Math.floor(Math.random() * 256),
					until: now + 700
				});
				dirty = true;
			}
			if (ptr.x >= 0) dirty = true; // caret blink
			if (dirty) {
				draw(now);
				dirty = false;
			}
			raf = requestAnimationFrame(loop);
		}

		const onMove = (e: PointerEvent) => {
			if (e.pointerType !== 'mouse') return;
			ptr.x = e.clientX;
			ptr.y = e.clientY;
			dirty = true;
		};
		const onLeave = () => {
			ptr.x = ptr.y = -1;
			dirty = true;
		};
		const redraw = () => {
			scroll = window.scrollY;
			readTheme();
			draw(performance.now());
		};

		const onResize = () => {
			resize();
			if (reduce) redraw();
		};

		resize();
		readTheme();
		scroll = window.scrollY;
		window.addEventListener('resize', onResize);
		window.addEventListener('pointermove', onMove, { passive: true });
		document.documentElement.addEventListener('pointerleave', onLeave);
		document.fonts?.ready.then(() => {
			measure();
			dirty = true;
			if (reduce) redraw();
		});

		let mo: MutationObserver | undefined;
		if (reduce) {
			window.addEventListener('scroll', redraw, { passive: true });
			mo = new MutationObserver(redraw);
			mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
			redraw();
		} else {
			mo = new MutationObserver(() => readTheme());
			mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
			raf = requestAnimationFrame(loop);
		}

		return () => {
			cancelAnimationFrame(raf);
			mo?.disconnect();
			window.removeEventListener('resize', onResize);
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('scroll', redraw);
			document.documentElement.removeEventListener('pointerleave', onLeave);
		};
	});
</script>

<canvas bind:this={canvas} class="field" aria-hidden="true" />

<style>
	.field {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		pointer-events: none;
	}
</style>
