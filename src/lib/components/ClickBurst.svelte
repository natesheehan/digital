<script lang="ts">
	import { onMount } from 'svelte';

	/** Every click gets a target lock: crop marks snap in, with a coordinate readout and an unsolicited statistic. */
	type Lock = { id: number; x: number; y: number; note: string };
	let locks: Lock[] = [];
	let next = 0;

	const notes = [
		'p < 0.05',
		'n = 1',
		'r² = 0.98',
		'σ = 0.31',
		'[citation needed]',
		'reproducible ✓',
		'et al.',
		'see fig. 3',
		'ibid.',
		'CC-BY 4.0',
		'data available on request',
		'reviewer 2 disagrees'
	];

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const onDown = (e: PointerEvent) => {
			if (e.button !== 0) return;
			const l = { id: next++, x: e.clientX, y: e.clientY, note: notes[Math.floor(Math.random() * notes.length)] };
			locks = [...locks.slice(-4), l];
			setTimeout(() => (locks = locks.filter((o) => o.id !== l.id)), 1100);
		};
		window.addEventListener('pointerdown', onDown, { passive: true });
		return () => window.removeEventListener('pointerdown', onDown);
	});
</script>

{#each locks as l (l.id)}
	<div class="lock" style="left:{l.x}px;top:{l.y}px" aria-hidden="true">
		<span class="c tl" /><span class="c tr" /><span class="c br" /><span class="c bl" />
		<span class="hair h" /><span class="hair v" />
		<span class="read">
			<span>x{String(Math.round(l.x)).padStart(4, '0')} y{String(Math.round(l.y)).padStart(4, '0')}</span>
			<span class="note">{l.note}</span>
		</span>
	</div>
{/each}

<style>
	.lock {
		position: fixed;
		width: 0;
		height: 0;
		pointer-events: none;
		z-index: 300;
		mix-blend-mode: difference;
		color: #fff;
		animation: out 1.1s linear forwards;
	}
	.c {
		position: absolute;
		width: 10px;
		height: 10px;
		border: 0 solid currentColor;
		animation: lock 0.45s cubic-bezier(0.19, 1, 0.22, 1) forwards;
	}
	.tl {
		--x: -1;
		--y: -1;
		border-top-width: 2px;
		border-left-width: 2px;
	}
	.tr {
		--x: 1;
		--y: -1;
		border-top-width: 2px;
		border-right-width: 2px;
	}
	.br {
		--x: 1;
		--y: 1;
		border-bottom-width: 2px;
		border-right-width: 2px;
	}
	.bl {
		--x: -1;
		--y: 1;
		border-bottom-width: 2px;
		border-left-width: 2px;
	}
	@keyframes lock {
		from {
			transform: translate(calc(-50% + var(--x) * 44px), calc(-50% + var(--y) * 44px));
			opacity: 0;
		}
		to {
			transform: translate(calc(-50% + var(--x) * 14px), calc(-50% + var(--y) * 14px));
			opacity: 1;
		}
	}
	.hair {
		position: absolute;
		background: currentColor;
		animation: hair 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
	}
	.hair.h {
		width: 60px;
		height: 1px;
		transform: translate(-50%, 0) scaleX(0);
	}
	.hair.v {
		width: 1px;
		height: 60px;
		transform: translate(0, -50%) scaleY(0);
	}
	@keyframes hair {
		to {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0.6;
		}
	}
	.read {
		position: absolute;
		left: 28px;
		top: 12px;
		display: flex;
		flex-direction: column;
		font-family: var(--font-mono);
		font-size: 10px;
		line-height: 1.35;
		white-space: nowrap;
		clip-path: inset(0 100% 0 0);
		animation: type 0.4s steps(12) 0.12s forwards;
	}
	.note {
		font-family: var(--font-hand);
		font-style: italic;
		font-size: 14px;
	}
	@keyframes type {
		to {
			clip-path: inset(0 0 0 0);
		}
	}
	@keyframes out {
		0%,
		70% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
