<script lang="ts">
	import { onMount } from 'svelte';

	/** The resident research assistant: a small CRT robot that looks around, blinks and idly bobs. */
	export let delay = 0;
	/** skip the draw-on and start moving straight away */
	export let instant = false;

	let animate = false;

	onMount(() => {
		animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	const d = instant ? -1200 : delay;
	const live = `${Math.max(0, (d + 1200) / 1000)}s`;
</script>

<svg viewBox="-6 -6 132 132" class="bot" class:live={animate} style="--d:{d}ms;--live:{live}" aria-hidden="true">
	<g class="bob">
		<path d="M60 26 V14" pathLength="1" class="ink" />
		<circle cx="60" cy="11" r="4" class="antenna" />
		<rect x="26" y="26" width="68" height="50" rx="8" pathLength="1" class="ink" />
		<rect x="33" y="33" width="54" height="36" rx="4" pathLength="1" class="ink thin" />
		<g class="eyes">
			<rect x="44" y="42" width="8" height="12" class="eye" />
			<rect x="68" y="42" width="8" height="12" class="eye" />
		</g>
		<path d="M52 62 H68" pathLength="1" class="ink thin" />
	</g>
	<path d="M60 76 V86 M36 100 V92 Q36 86 44 86 H76 Q84 86 84 92 V100" pathLength="1" class="ink" />
</svg>

<style>
	.bot {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
		color: inherit;
	}
	.ink {
		fill: none;
		stroke: currentColor;
		stroke-width: 3.5;
		stroke-linecap: square;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 1.1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
		animation-delay: var(--d);
	}
	.ink.thin {
		stroke-width: 2;
	}
	.antenna,
	.eye {
		fill: currentColor;
		opacity: 0;
		animation: fade-in 0.5s ease-out forwards;
		animation-delay: calc(var(--d) + 700ms);
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes fade-in {
		to {
			opacity: 1;
		}
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	.live .bob {
		animation: bob 3s ease-in-out infinite;
		animation-delay: var(--live);
	}
	@keyframes bob {
		50% {
			transform: translateY(-2px);
		}
	}
	.live .eyes {
		animation: look 5.5s cubic-bezier(0.7, 0, 0.3, 1) infinite;
		animation-delay: var(--live);
	}
	@keyframes look {
		0%,
		18%,
		100% {
			transform: translateX(0);
		}
		24%,
		40% {
			transform: translateX(-6px);
		}
		46%,
		62% {
			transform: translateX(6px);
		}
		68% {
			transform: translateX(0);
		}
	}
	.live .eye {
		transform-box: fill-box;
		transform-origin: center;
		animation: fade-in 0.5s ease-out forwards, lid 4.1s linear infinite;
		animation-delay: calc(var(--d) + 700ms), var(--live);
	}
	@keyframes lid {
		0%,
		94%,
		100% {
			transform: scaleY(1);
		}
		97% {
			transform: scaleY(0.1);
		}
	}
	.live .antenna {
		animation: fade-in 0.5s ease-out forwards, blink 1.6s steps(1) infinite;
		animation-delay: calc(var(--d) + 700ms), var(--live);
	}

	@media (prefers-reduced-motion: reduce) {
		.ink {
			stroke-dashoffset: 0;
		}
		.antenna,
		.eye {
			opacity: 1;
		}
	}
</style>
