<script lang="ts">
	import { onMount } from 'svelte';
	import { beforeNavigate, afterNavigate } from '$app/navigation';

	/** A black shutter scans down between pages while the modem dials in. */
	const names: Record<string, string> = { '/': '~', '/writing': '~/outputs', '/projects': '~/software', '/cv': '~/cv' };

	const logs = [
		['ok', 'handshake: *skreeeee-kshhhh*'],
		['ok', 'resolving DOIs'],
		['ok', 'checking licences: CC-BY-4.0'],
		['skip', 'peer review — reviewer 2 is using the phone line'],
		['ok', '640K ought to be enough for anybody'],
		['warn', 'caffeine below threshold'],
		['ok', 'defragmenting the literature'],
		['ok', 'loading 256 colours']
	];

	let phase: 'idle' | 'in' | 'out' = 'idle';
	let label = '~';
	let lines: string[][] = [];
	let started = 0;
	let reduce = false;

	onMount(() => {
		reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	beforeNavigate(({ to, from, type }) => {
		if (reduce || !to || type === 'leave') return;
		if (to.url.pathname === from?.url.pathname) return;
		label = names[to.url.pathname] ?? `~${to.url.pathname}`;
		const o = Math.floor(Math.random() * logs.length);
		lines = [['ok', 'ATDT 0800-OPEN-SCIENCE'], ...[0, 1].map((k) => logs[(o + k) % logs.length]), ['ok', 'CONNECT 56000']];
		phase = 'in';
		started = performance.now();
	});

	afterNavigate(() => {
		if (phase !== 'in') return;
		const wait = Math.max(0, 560 - (performance.now() - started));
		setTimeout(() => {
			phase = 'out';
			setTimeout(() => (phase = 'idle'), 560);
		}, wait);
	});
</script>

{#if phase !== 'idle'}
	<div class="curtain {phase}" aria-hidden="true">
		<span class="beam" />
		<div class="inner">
			<p class="cmd">$ cd {label}<span class="caret" /></p>
			<ul class="log">
				{#each lines as [s, text], i}
					<li style="--i:{i}"><span class="st {s}">[{s.padStart(4, ' ')}]</span> {text}</li>
				{/each}
			</ul>
			<span class="bar"><b /></span>
		</div>
	</div>
{/if}

<style>
	.curtain {
		position: fixed;
		inset: 0;
		z-index: 250;
		display: grid;
		place-items: center;
		/* the shutter takes the current theme: phosphor on black, or ink on paper */
		--tube: var(--bg);
		--phos: var(--ink);
		background: var(--tube);
		color: var(--phos);
		overflow: hidden;
	}
	:global(:root[data-theme='light']) .curtain::after {
		display: none;
	}
	:global(:root[data-theme='light']) .beam {
		box-shadow: none;
		background: var(--accent);
		opacity: 1;
	}
	:global(:root[data-theme='light']) .st.skip,
	:global(:root[data-theme='light']) .st.warn {
		background: var(--accent);
		color: var(--bg);
	}
	.curtain::after {
		content: '';
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(to bottom, transparent 0 2px, rgb(127 127 127 / 0.12) 2px 3px);
		pointer-events: none;
	}
	.curtain.in {
		animation: shut-in 0.42s cubic-bezier(0.7, 0, 0.3, 1) both;
	}
	.curtain.out {
		animation: shut-out 0.55s cubic-bezier(0.7, 0, 0.3, 1) both;
	}
	@keyframes shut-in {
		from {
			clip-path: inset(0 0 100% 0);
		}
		to {
			clip-path: inset(0 0 0 0);
		}
	}
	@keyframes shut-out {
		from {
			clip-path: inset(0 0 0 0);
		}
		to {
			clip-path: inset(100% 0 0 0);
		}
	}
	/* the bright leading edge of the shutter */
	.beam {
		position: absolute;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--phos);
		box-shadow: 0 0 16px 2px var(--phos);
		opacity: 0.6;
	}
	.in .beam {
		animation: beam-in 0.42s cubic-bezier(0.7, 0, 0.3, 1) both;
	}
	.out .beam {
		animation: beam-out 0.55s cubic-bezier(0.7, 0, 0.3, 1) both;
	}
	@keyframes beam-in {
		from {
			top: 0;
		}
		to {
			top: 100%;
		}
	}
	@keyframes beam-out {
		from {
			top: 0;
		}
		to {
			top: 100%;
		}
	}
	.inner {
		width: min(720px, calc(100% - 32px));
	}
	.out .inner {
		animation: fade 0.25s ease-in both;
	}
	@keyframes fade {
		to {
			opacity: 0;
		}
	}
	.cmd {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(2rem, 7vw, 5rem);
		line-height: 1;
		text-transform: none;
		letter-spacing: 0.01em;
	}
	.caret {
		display: inline-block;
		width: 0.45em;
		height: 0.8em;
		margin-left: 0.15em;
		background: var(--phos);
		animation: blink 0.5s steps(1) infinite;
	}
	.log {
		list-style: none;
		margin: 20px 0 0;
		padding: 0;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		line-height: 1.8;
		white-space: pre;
		overflow: hidden;
	}
	.log li {
		opacity: 0;
		animation: line 0.01s linear forwards;
		animation-delay: calc(120ms + var(--i) * 110ms);
	}
	.st {
		font-weight: 700;
	}
	.st.skip,
	.st.warn {
		background: var(--phos);
		color: var(--tube);
	}
	@keyframes line {
		to {
			opacity: 0.85;
		}
	}
	.bar {
		display: block;
		margin-top: 18px;
		height: 3px;
		background: rgb(127 127 127 / 0.35);
	}
	.bar b {
		display: block;
		height: 100%;
		background: var(--phos);
		transform-origin: left;
		animation: fill 0.55s cubic-bezier(0.7, 0, 0.3, 1) 0.1s both;
	}
	@keyframes fill {
		from {
			transform: scaleX(0);
		}
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
