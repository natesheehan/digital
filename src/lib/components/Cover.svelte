<script lang="ts">
	/** Deterministic generative artwork for projects without screenshots. */
	export let variant: 'river' | 'grid' | 'dots' = 'river';
	export let seed = 'x';

	function rng(str: string) {
		let h = 2166136261;
		for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
		return () => {
			h += 0x6d2b79f5;
			let t = h;
			t = Math.imul(t ^ (t >>> 15), t | 1);
			t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	const r = rng(seed);
	const W = 400;
	const H = 240;

	const rivers = Array.from({ length: 14 }, (_, i) => {
		const base = 20 + i * 15;
		const amp = 6 + r() * 14;
		const freq = 0.012 + r() * 0.01;
		const phase = r() * Math.PI * 2;
		let d = '';
		for (let x = 0; x <= W; x += 8) {
			const y = base + Math.sin(x * freq + phase) * amp + Math.sin(x * 0.041 + i) * 3;
			d += `${x === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`;
		}
		return { d, accent: i === 5 || i === 9, delay: i * 0.12 };
	});

	const dots = Array.from({ length: 180 }, () => {
		const x = r() * W;
		const y = r() * H;
		const v = Math.sin(x / 70) * Math.cos(y / 50) * 0.5 + 0.5;
		return { x, y, s: 1 + v * 4.5, hot: v > 0.78 };
	});

	const cells = Array.from({ length: 10 * 6 }, (_, i) => ({
		x: (i % 10) * 40,
		y: Math.floor(i / 10) * 40,
		on: r() > 0.72
	}));
</script>

<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" class="cover {variant}">
	{#if variant === 'river'}
		{#each rivers as line}
			<path
				d={line.d}
				class:accent={line.accent}
				style="animation-delay:-{line.delay}s"
				pathLength="1"
			/>
		{/each}
	{:else if variant === 'dots'}
		{#each dots as d, i}
			<circle cx={d.x} cy={d.y} r={d.s} class:hot={d.hot} style="animation-delay:{(i % 17) * 0.18}s" />
		{/each}
	{:else}
		{#each cells as c, i}
			<rect x={c.x + 3} y={c.y + 3} width="34" height="34" class:on={c.on} style="animation-delay:{(i % 13) * 0.25}s" />
		{/each}
	{/if}
</svg>

<style>
	.cover {
		width: 100%;
		height: 100%;
		display: block;
		background: var(--bg);
	}
	path {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1;
		opacity: 0.55;
		stroke-dasharray: 0.02 0.012;
		animation: flow 18s linear infinite;
	}
	path.accent {
		opacity: 1;
		stroke-width: 3;
		stroke-dasharray: none;
	}
	circle {
		fill: var(--ink);
		transform-box: fill-box;
		transform-origin: center;
		animation: breathe 3.6s ease-in-out infinite;
	}
	circle.hot {
		fill: var(--bg);
		stroke: var(--ink);
		stroke-width: 1.5;
	}
	rect {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1;
		opacity: 0.35;
	}
	rect.on {
		opacity: 1;
		fill: var(--ink);
		animation: blink 4s steps(1) infinite;
	}
	@keyframes flow {
		to {
			stroke-dashoffset: -1;
		}
	}
	@keyframes breathe {
		50% {
			transform: scale(0.5);
		}
	}
	@keyframes blink {
		50% {
			fill: transparent;
		}
	}
</style>
