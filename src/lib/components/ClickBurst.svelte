<script lang="ts">
	import { onMount } from 'svelte';

	/** Every click leaves a ping: a block cursor where you pressed, and a square that steps outward like a radar sweep on a monochrome tube. */
	type Ping = { id: number; x: number; y: number };
	let pings: Ping[] = [];
	let next = 0;

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const onDown = (e: PointerEvent) => {
			if (e.button !== 0) return;
			const p = { id: next++, x: e.clientX, y: e.clientY };
			pings = [...pings.slice(-5), p];
			setTimeout(() => (pings = pings.filter((o) => o.id !== p.id)), 700);
		};
		window.addEventListener('pointerdown', onDown, { passive: true });
		return () => window.removeEventListener('pointerdown', onDown);
	});
</script>

{#each pings as p (p.id)}
	<div class="ping" style="left:{p.x}px;top:{p.y}px" aria-hidden="true">
		<span class="ring" />
		<span class="ring late" />
		<span class="dot" />
	</div>
{/each}

<style>
	.ping {
		position: fixed;
		width: 0;
		height: 0;
		pointer-events: none;
		z-index: 300;
		color: var(--accent);
	}
	.ring,
	.dot {
		position: absolute;
		left: 0;
		top: 0;
	}
	.ring {
		width: 40px;
		height: 40px;
		margin: -20px 0 0 -20px;
		border: 1px solid currentColor;
		animation: sweep 0.6s steps(6) forwards;
	}
	.ring.late {
		animation-delay: 0.08s;
		opacity: 0;
	}
	@keyframes sweep {
		from {
			transform: scale(0.15);
			opacity: 1;
		}
		to {
			transform: scale(1);
			opacity: 0;
		}
	}
	.dot {
		width: 6px;
		height: 10px;
		margin: -5px 0 0 -3px;
		background: currentColor;
		animation: dot 0.6s steps(1) forwards;
	}
	@keyframes dot {
		0%,
		30%,
		60% {
			opacity: 1;
		}
		15%,
		45%,
		100% {
			opacity: 0;
		}
	}
</style>
