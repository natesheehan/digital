<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { profile } from '$lib/data';

	/**
	 * NATE QUEST: a tiny Game Boy-palette room. Walk about, inspect objects, collect the six
	 * records that make up the old "get to know me" notebook. Keyboard, click-to-walk and a
	 * touch d-pad all work; a plain-text version sits underneath for everyone else.
	 */
	const W = 320;
	const H = 192;
	const P = ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'];

	type Id = 'nameplate' | 'shelf' | 'board' | 'pc' | 'cork' | 'window' | 'bot';
	type Obj = { id: Id; label: string; x: number; y: number; w: number; h: number; stand: [number, number]; solid?: boolean };

	const objects: Obj[] = [
		{ id: 'shelf', label: 'BOOKSHELF', x: 16, y: 8, w: 40, h: 50, stand: [36, 70], solid: true },
		{ id: 'window', label: 'WINDOW', x: 78, y: 8, w: 44, h: 30, stand: [100, 62] },
		{ id: 'board', label: 'WHITEBOARD', x: 138, y: 8, w: 56, h: 32, stand: [166, 62] },
		{ id: 'cork', label: 'QUEST BOARD', x: 212, y: 10, w: 38, h: 30, stand: [231, 62] },
		{ id: 'nameplate', label: 'NAMEPLATE', x: 112, y: 104, w: 36, h: 22, stand: [128, 140], solid: true },
		{ id: 'pc', label: 'TERMINAL', x: 148, y: 88, w: 44, h: 38, stand: [172, 140], solid: true },
		{ id: 'bot', label: 'RESEARCH ASST.', x: 264, y: 76, w: 18, h: 26, stand: [273, 116], solid: true }
	];
	type Fact = Exclude<Id, 'bot'>;
	const facts: Fact[] = ['nameplate', 'shelf', 'board', 'pc', 'cork', 'window'];
	const solids = [...objects.filter((o) => o.solid), { x: 10, y: 150, w: 18, h: 24 }]; // + the plant

	const records: Record<Fact, string[]> = {
		nameplate: [
			'A nameplate on the desk. It hums faintly.',
			`NAME .... Nathanael Sheehan (he/him)\nBASED ... Munich <- via Exeter\nJOB ..... postdoc @ TUM\nORCID ... ${profile.orcid}`
		],
		shelf: [
			'Four volumes, shelved in order:',
			'1. BSc computer science\n2. MSc geography\n3. PhD environmental intelligence',
			'4. philosophy & sociology of science\n   <- you are here'
		],
		board: [
			'Questions scribbled on the whiteboard:',
			'? what counts as data?\n? who sets the standards?',
			'? openness vs. accountability\n? whose knowledge gets left out?'
		],
		pc: ['C:\\> DIR TOOLBOX', '> ethnographic observation\n> semi-structured interviews', '> quantitative modelling\n> R + Python, in the open'],
		cork: [
			'*** SIDE QUESTS ***',
			'[x] reading group: epistemic diversity (2wk)\n[x] Research Data Alliance: member',
			'[x] built gigwork.city\n[x] R packages shipped: 3'
		],
		window: ['Munich, out the window. A note is taped to the glass:', '"if you are well, all is well,\n and I am well too"']
	};

	function botLines(n: number) {
		if (n === 0)
			return ['BEEP. I am the research assistant.\nUnpaid, unreviewed, very keen.', `This lab holds ${facts.length} records about Nate.\nInspect things to collect them all.`];
		if (n < facts.length) return [`${n}/${facts.length} records collected.\n${facts.length - n} to go. BEEP.`];
		return ['Dataset complete. Peer review: waived.\nNate would like to hear from you. BEEP BOOP.'];
	}

	let canvas: HTMLCanvasElement;
	let screen: HTMLElement;
	let state: 'title' | 'play' | 'talk' | 'done' = 'title';
	let found = new Set<Id>();
	let near: Obj | null = null;
	let speaker = '';
	let pages: string[] = [];
	let pageIdx = 0;
	let shown = '';
	let typing = false;
	let afterTalk: (() => void) | null = null;
	let reduce = false;

	const player = { x: 60, y: 150, dir: 'down' as 'up' | 'down' | 'left' | 'right', step: 0, moving: false };
	let target: [number, number] | null = null;
	let pending: Obj | null = null;
	const held = { up: false, down: false, left: false, right: false };
	type Dir = keyof typeof held;
	const padKeys: [Dir, string][] = [
		['up', '▲'],
		['left', '◀'],
		['right', '▶'],
		['down', '▼']
	];

	$: count = [...found].filter((id) => id !== 'bot').length;

	/* ---------------- dialogue ---------------- */
	let typer: ReturnType<typeof setInterval> | undefined;
	function typePage() {
		clearInterval(typer);
		const full = pages[pageIdx];
		if (reduce) {
			shown = full;
			typing = false;
			return;
		}
		shown = '';
		typing = true;
		let i = 0;
		typer = setInterval(() => {
			i += 1;
			shown = full.slice(0, i);
			if (i >= full.length) {
				clearInterval(typer);
				typing = false;
			}
		}, 22);
	}

	function talk(who: string, lines: string[], then?: () => void) {
		speaker = who;
		pages = lines;
		pageIdx = 0;
		afterTalk = then ?? null;
		state = 'talk';
		held.up = held.down = held.left = held.right = false;
		target = null;
		typePage();
	}

	function advance() {
		if (state !== 'talk') return;
		if (typing) {
			clearInterval(typer);
			shown = pages[pageIdx];
			typing = false;
			return;
		}
		if (pageIdx < pages.length - 1) {
			pageIdx++;
			typePage();
			return;
		}
		state = 'play';
		const fn = afterTalk;
		afterTalk = null;
		fn?.();
	}

	function inspect(o: Obj) {
		const had = count;
		if (o.id === 'bot') {
			talk(o.label, botLines(had));
			return;
		}
		const isNew = !found.has(o.id);
		found = new Set([...found, o.id]);
		const lines = [...records[o.id]];
		if (isNew) lines.push(`+1 RECORD  (${had + 1}/${facts.length})`);
		talk(o.label, lines, () => {
			if (isNew && had + 1 === facts.length) {
				talk('SYSTEM', ['*** ACHIEVEMENT UNLOCKED ***\nYou know Nate. Dataset 6/6 complete.', 'Reward: an open invitation to collaborate.'], () => (state = 'done'));
			}
		});
	}

	/* ---------------- control ---------------- */
	async function start() {
		state = 'play';
		await tick();
		screen?.focus();
		if (found.size === 0) talk('RESEARCH ASST.', ['BEEP. Welcome to the lab.', 'Walk with ARROWS / WASD, or click where to go.\nPress SPACE near things to inspect them.']);
	}

	function restart() {
		found = new Set();
		Object.assign(player, { x: 60, y: 150, dir: 'down' });
		state = 'title';
	}

	const keymap: Record<string, keyof typeof held> = {
		ArrowUp: 'up',
		KeyW: 'up',
		ArrowDown: 'down',
		KeyS: 'down',
		ArrowLeft: 'left',
		KeyA: 'left',
		ArrowRight: 'right',
		KeyD: 'right'
	};

	function onKey(e: KeyboardEvent, down: boolean) {
		if (state === 'title' || state === 'done') {
			if (down && (e.code === 'Enter' || e.code === 'Space')) {
				e.preventDefault();
				if (state === 'title') start();
			}
			return;
		}
		const k = keymap[e.code];
		if (k) {
			e.preventDefault();
			if (state === 'play') held[k] = down;
			else held[k] = false;
			target = null;
			pending = null;
			return;
		}
		if (down && (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyZ')) {
			e.preventDefault();
			if (state === 'talk') advance();
			else if (near) inspect(near);
		}
		if (down && e.code === 'Escape' && state === 'talk') {
			clearInterval(typer);
			state = 'play';
			afterTalk?.();
			afterTalk = null;
		}
	}

	function toLogical(e: PointerEvent): [number, number] {
		const r = canvas.getBoundingClientRect();
		return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
	}

	function onPoint(e: PointerEvent) {
		screen.focus();
		if (state === 'talk') return advance();
		if (state !== 'play') return;
		const [x, y] = toLogical(e);
		const hit = objects.find((o) => x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h);
		if (hit) {
			pending = hit;
			target = [...hit.stand];
		} else {
			pending = null;
			target = [x, Math.max(62, y)];
		}
	}

	function pad(k: Dir, v: boolean) {
		if (state === 'talk' && v) return advance();
		if (state === 'play') {
			held[k] = v;
			target = null;
		}
	}
	function padA() {
		if (state === 'talk') advance();
		else if (state === 'play' && near) inspect(near);
		else if (state === 'title') start();
	}

	/* ---------------- world ---------------- */
	function blocked(x: number, y: number) {
		if (x < 14 || x > 306 || y < 62 || y > 182) return true;
		return solids.some((s) => x + 5 > s.x && x - 5 < s.x + s.w && y > s.y + s.h - 14 && y - 4 < s.y + s.h);
	}

	function update() {
		if (state !== 'play') {
			player.moving = false;
			return;
		}
		let dx = (held.right ? 1 : 0) - (held.left ? 1 : 0);
		let dy = (held.down ? 1 : 0) - (held.up ? 1 : 0);
		if (!dx && !dy && target) {
			const tx = target[0] - player.x;
			const ty = target[1] - player.y;
			const d = Math.hypot(tx, ty);
			if (d < 1.6) {
				target = null;
				if (pending) {
					player.dir = pending.stand[1] > pending.y + pending.h ? 'up' : 'right';
					const o = pending;
					pending = null;
					inspect(o);
					return;
				}
			} else {
				dx = tx / d;
				dy = ty / d;
			}
		}
		const len = Math.hypot(dx, dy);
		player.moving = len > 0;
		if (!len) return;
		const sp = 1.3;
		const vx = (dx / len) * sp;
		const vy = (dy / len) * sp;
		const bx = blocked(player.x + vx, player.y);
		const by = blocked(player.x, player.y + vy);
		if (!bx) player.x += vx;
		if (!by) player.y += vy;
		if (bx && by && target) target = null;
		player.dir = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 'right' : 'left') : vy > 0 ? 'down' : 'up';
		player.step++;
	}

	function findNear() {
		let best: Obj | null = null;
		let bd = 22;
		for (const o of objects) {
			const d = Math.hypot(player.x - o.stand[0], player.y - o.stand[1]);
			if (d < bd) {
				bd = d;
				best = o;
			}
		}
		near = best;
	}

	/* ---------------- pixel art ---------------- */
	let g: CanvasRenderingContext2D;
	const r = (c: number, x: number, y: number, w: number, h: number) => {
		g.fillStyle = P[c];
		g.fillRect(Math.round(x), Math.round(y), w, h);
	};
	const box = (c: number, x: number, y: number, w: number, h: number) => {
		r(c, x, y, w, 1);
		r(c, x, y + h - 1, w, 1);
		r(c, x, y, 1, h);
		r(c, x + w - 1, y, 1, h);
	};

	function drawRoom(t: number) {
		// back wall with a thin stripe paper
		r(1, 0, 0, W, 48);
		for (let x = 4; x < W; x += 8) r(0, x, 2, 1, 40);
		r(0, 0, 44, W, 4);
		// floor tiles
		for (let y = 48; y < H; y += 16) for (let x = 0; x < W; x += 16) r((x + y) / 16 % 2 ? 2 : 3, x, y, 16, 16);
		// walls
		r(0, 0, 0, 8, H);
		r(0, W - 8, 0, 8, H);
		r(0, 0, H - 8, W, 8);
		// rug
		r(1, 104, 146, 96, 30);
		box(0, 106, 148, 92, 26);
		for (let x = 112; x < 194; x += 8) r(2, x, 160, 4, 2);

		// bookshelf
		r(0, 16, 8, 40, 50);
		for (const sy of [12, 27, 42]) {
			let bx = 19;
			let i = 0;
			while (bx < 52) {
				const bw = 3 + ((sy + i * 7) % 3);
				const bh = 9 + ((sy + i * 5) % 4);
				r(i % 2 ? 2 : 3, bx, sy + 13 - bh, bw, bh);
				bx += bw + 1;
				i++;
			}
			r(1, 18, sy + 13, 36, 2);
		}

		// window: sky, a slow cloud, the twin towers of the Frauenkirche
		r(0, 78, 8, 44, 30);
		r(3, 80, 10, 40, 26);
		const cx = 80 + ((t / 90) % 50) - 10;
		g.save();
		g.beginPath();
		g.rect(80, 10, 40, 26);
		g.clip();
		r(2, cx, 15, 10, 3);
		r(2, cx + 3, 13, 5, 2);
		g.restore();
		r(1, 90, 22, 5, 14);
		r(1, 99, 22, 5, 14);
		r(1, 91, 19, 3, 3);
		r(1, 100, 19, 3, 3);
		r(1, 80, 33, 40, 3);
		r(0, 80, 22, 40, 1);
		r(3, 108, 30, 6, 3); // the note on the glass

		// whiteboard
		r(0, 138, 8, 56, 32);
		r(3, 140, 10, 52, 26);
		for (const [qx, qy] of [
			[146, 14],
			[164, 20],
			[180, 13]
		]) {
			r(1, qx, qy, 4, 1);
			r(1, qx + 4, qy + 1, 1, 2);
			r(1, qx + 2, qy + 3, 2, 1);
			r(1, qx + 2, qy + 4, 1, 2);
			r(1, qx + 2, qy + 7, 1, 1);
		}
		r(1, 146, 30, 30, 1);
		r(1, 170, 26, 16, 1);
		r(0, 140, 36, 52, 2);

		// quest board
		r(0, 212, 10, 38, 30);
		r(1, 214, 12, 34, 26);
		for (const [px, py] of [
			[216, 14],
			[230, 16],
			[218, 26],
			[234, 27]
		]) {
			r(3, px, py, 11, 8);
			r(0, px + 5, py, 1, 1);
			r(2, px + 2, py + 3, 7, 1);
			r(2, px + 2, py + 5, 5, 1);
		}

		// plant
		r(1, 12, 164, 14, 10);
		box(0, 12, 164, 14, 10);
		r(0, 18, 150, 2, 14);
		r(1, 12, 152, 6, 3);
		r(1, 20, 148, 7, 3);
		r(0, 14, 157, 5, 2);
		r(0, 20, 155, 6, 2);
	}

	function drawDesk(t: number) {
		r(0, 112, 104, 80, 22);
		r(1, 113, 105, 78, 6);
		r(2, 114, 112, 76, 12);
		box(0, 116, 113, 32, 10);
		r(0, 114, 126, 3, 8);
		r(0, 187, 126, 3, 8);
		r(3, 118, 100, 20, 5);
		box(0, 118, 100, 20, 5);
		r(0, 122, 102, 12, 1);
		r(0, 154, 82, 32, 20);
		r(2, 156, 84, 28, 15);
		r(0, 166, 102, 8, 3);
		for (let l = 0; l < 3; l++) r(1, 158, 87 + l * 4, 8 + ((l * 7) % 10), 1);
		if (Math.floor(t / 500) % 2) r(0, 168, 95, 3, 2);
	}

	function drawBot(t: number) {
		const bob = reduce ? 0 : Math.floor(t / 400) % 2;
		const x = 264;
		const y = 76 - bob;
		r(0, x + 8, y, 2, 4);
		if (Math.floor(t / 700) % 2) r(0, x + 7, y - 2, 4, 2);
		r(0, x, y + 4, 18, 13);
		r(2, x + 2, y + 6, 14, 9);
		const look = reduce ? 0 : [0, -1, 0, 1][Math.floor(t / 1400) % 4];
		const blink = Math.floor(t / 100) % 40 === 0;
		if (!blink) {
			r(0, x + 5 + look, y + 8, 2, 3);
			r(0, x + 11 + look, y + 8, 2, 3);
		}
		r(0, x + 7, y + 13, 4, 1);
		r(0, x + 8, y + 17, 2, 3);
		r(0, x + 3, y + 20, 12, 6);
		r(1, x + 5, y + 22, 8, 2);
	}

	function drawPlayer() {
		const { x, y, dir } = player;
		const f = player.moving ? Math.floor(player.step / 8) % 2 : 0;
		const X = Math.round(x);
		const Y = Math.round(y);
		r(1, X - 5, Y, 10, 1); // shadow
		// legs
		r(0, X - 4, Y - 4 - (f ? 1 : 0), 3, 4 + (f ? 1 : 0));
		r(0, X + 1, Y - 4 - (f ? 0 : 1), 3, 4 + (f ? 0 : 1));
		// body + arms
		r(1, X - 5, Y - 10, 10, 6);
		r(0, X - 5, Y - 10, 10, 1);
		r(3, X - 6, Y - 9 + f, 1, 4);
		r(3, X + 5, Y - 9 + (f ? 0 : 1), 1, 4);
		// head
		r(3, X - 4, Y - 16, 8, 6);
		r(0, X - 4, Y - 17, 8, 2);
		if (dir === 'up') r(0, X - 4, Y - 16, 8, 4);
		else if (dir === 'down') {
			// the academic's glasses
			r(0, X - 4, Y - 14, 3, 2);
			r(0, X + 1, Y - 14, 3, 2);
			r(0, X - 1, Y - 14, 2, 1);
		} else {
			const s = dir === 'left' ? -1 : 1;
			r(0, X - 4 + (s < 0 ? 0 : 5), Y - 16, 3, 3);
			r(0, X + (s < 0 ? -4 : 1), Y - 14, 3, 2);
		}
	}

	function drawBubble(o: Obj, t: number) {
		const bx = o.x + o.w / 2 - 4;
		const by = Math.max(1, o.y - 11 - (reduce ? 0 : Math.floor(t / 300) % 2));
		r(0, bx, by, 9, 10);
		r(3, bx + 1, by + 1, 7, 8);
		r(0, bx + 4, by + 2, 1, 4);
		r(0, bx + 4, by + 7, 1, 1);
	}

	function drawFound() {
		for (const o of objects) {
			if (!found.has(o.id) || o.id === 'bot') continue;
			const cx = o.x + o.w - 4;
			const cy = o.y + 2;
			r(3, cx - 1, cy - 1, 6, 6);
			r(0, cx, cy + 2, 1, 1);
			r(0, cx + 1, cy + 3, 1, 1);
			r(0, cx + 2, cy + 2, 1, 1);
			r(0, cx + 3, cy + 1, 1, 1);
		}
	}

	function render(t: number) {
		drawRoom(t);
		drawFound();
		// depth: whatever stands lower on screen is drawn later
		const layers: [number, () => void][] = [
			[126, () => drawDesk(t)],
			[102, () => drawBot(t)],
			[player.y, drawPlayer]
		];
		layers.sort((a, b) => a[0] - b[0]).forEach(([, fn]) => fn());
		if (state === 'play' && near) drawBubble(near, t);
	}

	onMount(() => {
		reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		g = canvas.getContext('2d')!;
		g.imageSmoothingEnabled = false;
		let raf = 0;
		let visible = false;
		const io = new IntersectionObserver(([e]) => {
			visible = e.isIntersecting;
			if (visible && !raf) raf = requestAnimationFrame(loop);
		});
		io.observe(canvas);
		function loop(t: number) {
			raf = 0;
			if (!visible) return;
			update();
			findNear();
			render(t);
			raf = requestAnimationFrame(loop);
		}
		render(0);
		return () => {
			io.disconnect();
			cancelAnimationFrame(raf);
			clearInterval(typer);
		};
	});
</script>

<div class="win game">
	<div class="winbar"><span>NATEQUEST.EXE — get to know me</span><span class="winbtns"><i>_</i><i>□</i><i>×</i></span></div>

	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		class="screen"
		bind:this={screen}
		tabindex="0"
		role="application"
		aria-label="Nate Quest, a small game. Arrow keys or WASD to move, space to inspect. A text version follows."
		on:keydown={(e) => onKey(e, true)}
		on:keyup={(e) => onKey(e, false)}
		on:blur={() => (held.up = held.down = held.left = held.right = false)}
	>
		<canvas bind:this={canvas} width={W} height={H} on:pointerdown={onPoint} aria-hidden="true" />

		{#if state === 'title'}
			<div class="overlay title">
				<p class="logo">NATE<br />QUEST</p>
				<p class="sub">a very short game about who I am</p>
				<button class="press" on:click={start}>▶ PRESS START</button>
				<p class="tiny">© 2026 SHEEHAN SOFT · 1 PLAYER · 6 RECORDS</p>
			</div>
		{:else if state === 'done'}
			<div class="overlay done">
				<p class="logo small">DATASET<br />COMPLETE</p>
				<p class="sub">6/6 records about Nate collected.</p>
				<div class="row">
					<a class="press" href="mailto:{profile.email}">✉ SEND MAIL</a>
					<button class="press ghost" on:click={() => (state = 'play')}>KEEP EXPLORING</button>
					<button class="press ghost" on:click={restart}>RESTART</button>
				</div>
			</div>
		{/if}

		{#if state === 'talk'}
			<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
			<div class="dialog" on:click={advance} aria-live="polite">
				<span class="who">{speaker}</span>
				<p>{shown}</p>
				{#if !typing}<span class="more" aria-hidden="true">▼</span>{/if}
			</div>
		{/if}
	</div>

	<div class="status">
		<span class="cell">RECORDS <span class="pips" aria-hidden="true">{#each facts as id}<b class:on={found.has(id)} />{/each}</span> {count}/{facts.length}</span>
		<span class="cell hint">
			{#if state === 'play' && near}SPACE: inspect {near.label.toLowerCase()}{:else}ARROWS/WASD move · SPACE inspect · click to walk{/if}
		</span>
	</div>

	<div class="pad" aria-label="Game controls">
		<div class="dpad">
			{#each padKeys as [k, sym]}
				<button
					class="k {k}"
					aria-label={k}
					on:pointerdown|preventDefault={() => pad(k, true)}
					on:pointerup={() => pad(k, false)}
					on:pointerleave={() => pad(k, false)}
					on:pointercancel={() => pad(k, false)}>{sym}</button
				>
			{/each}
		</div>
		<button class="a" on:click={padA} aria-label="Inspect / next">A</button>
	</div>
</div>

<details class="plain">
	<summary>skip the game — view as plain text (ABOUT.TXT)</summary>
	<pre>{facts.map((id) => `== ${objects.find((o) => o.id === id)?.label} ==\n${records[id].slice(1).join('\n')}`).join('\n\n')}</pre>
</details>

<style>
	.game {
		max-width: 880px;
		margin: 0 auto;
	}
	.screen {
		position: relative;
		margin-top: 3px;
		background: #0f380f;
		box-shadow: inset 2px 2px var(--b-shade), inset -2px -2px var(--b-light);
		padding: 6px;
		outline: none;
	}
	.screen:focus-visible {
		outline: 2px dotted var(--ink);
		outline-offset: 2px;
	}
	canvas {
		display: block;
		width: 100%;
		aspect-ratio: 320 / 192;
		image-rendering: pixelated;
		cursor: pointer;
		touch-action: manipulation;
	}

	.overlay {
		position: absolute;
		inset: 6px;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 14px;
		text-align: center;
		background: rgb(15 56 15 / 0.82);
		color: #9bbc0f;
		text-shadow: none;
	}
	.logo {
		margin: 0;
		font-family: var(--font-pixel);
		font-size: clamp(1.6rem, 6vw, 3.4rem);
		line-height: 1.1;
		color: #9bbc0f;
		text-shadow: 4px 4px 0 #306230;
	}
	.logo.small {
		font-size: clamp(1.1rem, 4vw, 2.2rem);
	}
	.sub {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.1rem, 2.6vw, 1.6rem);
	}
	.tiny {
		margin: 0;
		font-family: var(--font-pixel);
		font-size: 0.5rem;
		color: #8bac0f;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		justify-content: center;
	}
	.press,
	.press:visited {
		padding: 10px 16px;
		border: 0;
		background: #9bbc0f;
		color: #0f380f;
		font-family: var(--font-pixel);
		font-size: clamp(0.55rem, 1.4vw, 0.75rem);
		text-decoration: none;
		cursor: pointer;
		box-shadow: 4px 4px 0 #306230;
	}
	.title .press {
		animation: blink 1s steps(1) infinite;
	}
	.press:hover {
		background: #8bac0f;
		color: #0f380f;
	}
	.press.ghost {
		background: transparent;
		color: #9bbc0f;
		box-shadow: inset 0 0 0 2px #9bbc0f;
	}

	.dialog {
		position: absolute;
		left: 12px;
		right: 12px;
		bottom: 12px;
		padding: 10px 14px 12px;
		background: #9bbc0f;
		color: #0f380f;
		text-shadow: none;
		box-shadow: 0 0 0 3px #0f380f, 0 0 0 5px #9bbc0f, 0 0 0 7px #0f380f;
		cursor: pointer;
	}
	.dialog p {
		margin: 0;
		min-height: 2.4em;
		font-family: var(--font-display);
		font-size: clamp(1.05rem, 2.6vw, 1.55rem);
		line-height: 1.15;
		white-space: pre-wrap;
	}
	.who {
		position: absolute;
		top: -14px;
		left: 10px;
		padding: 2px 8px;
		background: #0f380f;
		color: #9bbc0f;
		font-family: var(--font-pixel);
		font-size: 0.5rem;
	}
	.more {
		position: absolute;
		right: 12px;
		bottom: 6px;
		font-size: 0.8rem;
		animation: blink 0.6s steps(1) infinite;
	}

	.status {
		display: flex;
		gap: 3px;
		margin-top: 3px;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-shadow: none;
	}
	.cell {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 2px 8px;
		box-shadow: inset 1px 1px var(--b-shade), inset -1px -1px var(--b-light);
		color: var(--ink);
	}
	:global(:root[data-theme='light']) .cell {
		color: #000;
	}
	.hint {
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.pips {
		display: inline-flex;
		gap: 2px;
	}
	.pips b {
		width: 8px;
		height: 8px;
		box-shadow: inset 0 0 0 1px currentColor;
	}
	.pips b.on {
		background: currentColor;
	}

	/* touch controls */
	.pad {
		display: none;
		justify-content: space-between;
		align-items: center;
		padding: 12px 18px 8px;
	}
	@media (pointer: coarse), (max-width: 640px) {
		.pad {
			display: flex;
		}
		.hint {
			display: none;
		}
	}
	.dpad {
		display: grid;
		grid-template: 'x u y' 38px 'l x2 r' 38px 'z d w' 38px / 38px 38px 38px;
	}
	.pad button {
		border: 0;
		background: var(--face);
		color: var(--ink);
		font-size: 0.9rem;
		touch-action: none;
		user-select: none;
		box-shadow: inset -1px -1px var(--b-dark), inset 1px 1px var(--b-light), inset -2px -2px var(--b-shade),
			inset 2px 2px var(--b-soft);
	}
	:global(:root[data-theme='light']) .pad button {
		color: #000;
	}
	.pad button:active {
		box-shadow: inset 1px 1px var(--b-dark), inset -1px -1px var(--b-light);
	}
	.k.up {
		grid-area: u;
	}
	.k.left {
		grid-area: l;
	}
	.k.right {
		grid-area: r;
	}
	.k.down {
		grid-area: d;
	}
	.a {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		font-family: var(--font-pixel);
		font-size: 0.9rem !important;
	}

	.plain {
		max-width: 880px;
		margin: 18px auto 0;
		font-size: 0.8rem;
	}
	.plain summary {
		cursor: pointer;
		color: var(--muted);
	}
	.plain pre {
		margin: 12px 0 0;
		padding: 16px;
		white-space: pre-wrap;
		font-family: var(--font-mono);
		border: 1px dashed var(--line-soft);
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
