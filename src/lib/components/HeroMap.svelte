<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { profile, publications, software } from '$lib/data';

	type Node = {
		key: string;
		label: string;
		sub: string;
		href: string;
		external?: boolean;
		x: number;
		y: number;
		small?: boolean;
		preview: string[];
	};

	const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

	const nodes: Node[] = [
		{
			key: 'outputs',
			label: '~/outputs/',
			sub: `${publications.length} items`,
			href: '/writing',
			x: 140,
			y: 120,
			preview: publications.slice(0, 4).map((p) => `${p.year}  ${cut(p.title, 34)}`)
		},
		{
			key: 'software',
			label: '~/software/',
			sub: `${software.length} projects`,
			href: '/projects',
			x: 140,
			y: 440,
			preview: software.map((s) => `${s.name.padEnd(12)} ${s.kind.toLowerCase()}`)
		},
		{
			key: 'cv',
			label: '~/cv.pdf',
			sub: 'curriculum vitae',
			href: '/cv',
			x: 860,
			y: 120,
			preview: ['CV.pdf', 'source → github.com/natesheehan/cv']
		},
		{
			key: 'notebook',
			label: '~/notebook.md',
			sub: 'get to know me',
			href: '#notebook',
			x: 860,
			y: 440,
			preview: ['id-card.txt', 'how-i-got-here.md', 'toolbox.sh', 'side-quests.log']
		},
		{
			key: 'contact',
			label: '~/contact.sh',
			sub: 'say hello',
			href: '#contact',
			x: 500,
			y: 528,
			preview: [profile.email]
		},
		{
			key: 'orcid',
			label: 'orcid ↗',
			sub: profile.orcid,
			href: profile.links.orcid,
			external: true,
			x: 290,
			y: 548,
			small: true,
			preview: ['publications · data · peer review']
		},
		{
			key: 'github',
			label: 'github ↗',
			sub: '@natesheehan',
			href: profile.links.github,
			external: true,
			x: 710,
			y: 548,
			small: true,
			preview: ['R packages · dashboards · this site']
		}
	];

	const C = { x: 500, y: 290 };

	/** A gently bowed curve from the centre to each node. */
	function edge(n: Node) {
		const mx = (C.x + n.x) / 2;
		const my = (C.y + n.y) / 2;
		const dx = n.x - C.x;
		const dy = n.y - C.y;
		const len = Math.hypot(dx, dy) || 1;
		const bow = 36;
		return `M${C.x} ${C.y} Q${(mx - (dy / len) * bow).toFixed(1)} ${(my + (dx / len) * bow).toFixed(1)} ${n.x} ${n.y}`;
	}

	/* ---------- terminal boot sequence ---------- */
	const research = '# data · standards · research infrastructure · open science';
	const cmd1 = 'whoami';
	const cmd2 = 'tree ~ --links';
	let typed1 = '';
	let typed2 = '';
	let showName = false;
	let showMap = false;
	let active: Node | null = null;

	function open(n: Node) {
		if (n.external) window.location.href = n.href;
		else if (n.href.startsWith('#')) document.querySelector(n.href)?.scrollIntoView({ behavior: 'smooth' });
		else goto(n.href);
	}

	onMount(() => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const timers: ReturnType<typeof setTimeout>[] = [];
		const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

		if (reduce) {
			typed1 = cmd1;
			typed2 = cmd2;
			showName = showMap = true;
		} else {
			let t = 350;
			for (let i = 1; i <= cmd1.length; i++) at((t += 70), () => (typed1 = cmd1.slice(0, i)));
			at((t += 250), () => (showName = true));
			t += 900;
			for (let i = 1; i <= cmd2.length; i++) at((t += 45), () => (typed2 = cmd2.slice(0, i)));
			at((t += 250), () => (showMap = true));
		}

		const onKey = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			const el = e.target as HTMLElement;
			if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
			const idx = Number(e.key) - 1;
			if (idx >= 0 && idx < nodes.length && showMap) open(nodes[idx]);
		};
		window.addEventListener('keydown', onKey);

		return () => {
			timers.forEach(clearTimeout);
			window.removeEventListener('keydown', onKey);
		};
	});
</script>

<div class="term win">
	<div class="winbar">
		<span>MS-DOS Prompt — nsheehan@tum: ~ — 80×25</span>
		<span class="winbtns" aria-hidden="true"><i>_</i><i>□</i><i>×</i></span>
	</div>

	<div class="screen win-body">
		<p class="line"><span class="ps1">nsheehan@tum:~$</span> {typed1}{#if !showName}<span class="caret" />{/if}</p>

		{#if showName}
			<h1 class="name" aria-label={profile.name}>
				{#each profile.name.toUpperCase().split('') as ch, i}
					<span class="ch" class:gap={ch === ' '} style="--i:{i}">{ch === ' ' ? ' ' : ch}</span>
				{/each}
			</h1>
			<p class="line out">{research}</p>
			<p class="line"><span class="ps1">nsheehan@tum:~$</span> {typed2}{#if !showMap}<span class="caret" />{/if}</p>
		{/if}

		<!-- desktop: animated link diagram -->
		<div class="stage" class:on={showMap} aria-hidden={!showMap}>
			<svg class="wires" viewBox="0 0 1000 600" aria-hidden="true">
				<g>
					{#each nodes as n, i}
						<path
							id="edge-{n.key}"
							d={edge(n)}
							pathLength="1"
							class="wire"
							class:hot={active?.key === n.key}
							style="--i:{i}"
						/>
					{/each}
				</g>
				{#if showMap}
					{#each nodes as n, i}
						<rect class="packet" width="7" height="7" x="-3.5" y="-3.5">
							<animateMotion dur="{2.6 + (i % 3) * 0.5}s" begin="{1.2 + i * 0.3}s" repeatCount="indefinite" rotate="auto">
								<mpath href="#edge-{n.key}" />
							</animateMotion>
						</rect>
						{#if active?.key === n.key}
							<rect class="packet hot" width="9" height="9" x="-4.5" y="-4.5">
								<animateMotion dur="0.8s" repeatCount="indefinite" rotate="auto" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
									<mpath href="#edge-{n.key}" />
								</animateMotion>
							</rect>
						{/if}
					{/each}
				{/if}
			</svg>

			<!-- centre: the annotated figure -->
			<figure class="me" style="left:{C.x / 10}%;top:{C.y / 6}%">
				<div class="sheet">
					{#each [0, 1, 2, 3] as f}<div class="frame" style="--f:{f}"><span class="dots-ht" /></div>{/each}
					<span class="flash" />
					<span class="plate-id">SUBJ. 01 · 4 EXP.</span>
				</div>
			</figure>

			<div class="callout right" style="left:72%;top:47%">
				<svg viewBox="0 0 50 30" class="arrow left"><path d="M48 15 H4" pathLength="1" /><circle cx="4" cy="15" r="3" /></svg>
				<span class="hand">postdoc @ TUM<br />munich ✶</span>
			</div>
			<div class="callout left" style="left:28%;top:47%">
				<span class="hand small">fig. 1 — the author, in<br />four states of attention</span>
				<svg viewBox="0 0 50 30" class="arrow right"><path d="M2 15 H46" pathLength="1" /><circle cx="46" cy="15" r="3" /></svg>
			</div>

			{#each nodes as n, i}
				<a
					class="node"
					class:small={n.small}
					class:hot={active?.key === n.key}
					href={n.href}
					style="left:{n.x / 10}%;top:{n.y / 6}%;--i:{i}"
					on:mouseenter={() => (active = n)}
					on:mouseleave={() => (active = null)}
					on:focus={() => (active = n)}
					on:blur={() => (active = null)}
					tabindex={showMap ? 0 : -1}
				>
					<span class="lbl"><kbd>{i + 1}</kbd>{n.label}</span>
					<span class="sub">{n.sub}</span>
					{#if active?.key === n.key}
						<span class="ls" class:up={n.y > 400} class:start={n.x < 300} class:end={n.x > 700}>
							<span class="ls-cmd">$ ls {n.label.replace(' ↗', '')}</span>
							{#each n.preview as row}<span>{row}</span>{/each}
						</span>
					{/if}
				</a>
			{/each}
		</div>

		<!-- mobile: the same links as `tree` output -->
		<div class="tree" class:on={showMap}>
			<div class="tree-me">
				<div class="sheet mini">
					{#each [0, 1, 2, 3] as f}<div class="frame" style="--f:{f}"><span class="dots-ht" /></div>{/each}
				</div>
				<p class="hand">postdoc @ TUM<br /><span class="small">munich ✶</span></p>
			</div>
			<p class="tree-root">~</p>
			<ul>
				{#each nodes as n, i}
					<li style="--i:{i}">
						<span class="branch" aria-hidden="true" />
						<a href={n.href}>
							<span><b>{n.label}</b><br /><span class="sub">{n.sub}</span></span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="statusbar">
		<span class="mode">{active ? 'VISUAL' : 'NORMAL'}</span>
		<span class="path">{active ? `${active.label}  ·  ${active.sub}` : '~'}</span>
		<span class="hint">hover to ls · press 1–{nodes.length} to cd</span>
	</div>
</div>

<style>
	.term {
		box-shadow: inset -1px -1px var(--b-dark), inset 1px 1px var(--b-light), inset -2px -2px var(--b-shade),
			inset 2px 2px var(--b-soft), var(--shadow-lg);
	}

	.screen {
		position: relative;
		margin-top: 3px;
		padding: 18px clamp(14px, 3vw, 28px) 12px;
		min-height: 200px;
	}
	.line {
		margin: 0;
		font-size: 0.9rem;
	}
	.line.out {
		margin-bottom: 14px;
		color: var(--muted);
		animation: out-in 0.8s var(--ease-io) 0.4s both;
	}
	@keyframes out-in {
		from {
			opacity: 0;
		}
	}
	.ps1 {
		font-weight: 700;
		margin-right: 0.5em;
	}
	.caret {
		display: inline-block;
		width: 0.6em;
		height: 1.1em;
		margin-left: 2px;
		vertical-align: text-bottom;
		background: var(--ink);
		animation: blink 1s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	.name {
		margin: 6px 0 10px;
		font-size: clamp(3.4rem, 8.6vw, 7.4rem);
		line-height: 0.9;
		white-space: nowrap;
	}
	.ch {
		display: inline-block;
		animation: resolve 1.1s var(--ease-expo) both;
		animation-delay: calc(var(--i) * 35ms);
	}
	.ch:not(.gap):hover {
		background: var(--ink);
		color: var(--bg-raised);
	}
	/* each letter comes into focus, like a lens racking in */
	@keyframes resolve {
		from {
			opacity: 0;
			transform: translateY(0.25em) scaleY(1.4);
			filter: blur(10px);
		}
		40% {
			opacity: 1;
		}
		to {
			opacity: 1;
			transform: none;
			filter: none;
		}
	}
	@media (max-width: 640px) {
		.name {
			white-space: normal;
		}
		.ch.gap {
			display: block;
			height: 0;
		}
	}

	/* ============ stage (desktop) ============ */
	.stage {
		position: relative;
		aspect-ratio: 1000 / 600;
		margin-top: 8px;
		visibility: hidden;
	}
	.stage.on {
		visibility: visible;
	}
	.wires {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.wire {
		fill: none;
		stroke: var(--ink);
		stroke-width: 2;
		stroke-linecap: square;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		transition: stroke-width 0.3s var(--ease-expo);
	}
	.stage.on .wire {
		animation: draw 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
		animation-delay: calc(200ms + var(--i) * 110ms);
	}
	.wire.hot {
		stroke-width: 4;
	}
	.packet {
		fill: var(--ink);
	}
	.packet.hot {
		fill: var(--bg);
		stroke: var(--ink);
		stroke-width: 2;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	.me {
		position: absolute;
		margin: 0;
		transform: translate(-50%, -50%);
		z-index: 2;
	}
	.sheet {
		position: relative;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
		width: clamp(150px, 17vw, 210px);
		padding: 8px 8px 26px;
		background: var(--bg-raised);
		border: 2px solid var(--ink);
		box-shadow: var(--shadow);
		opacity: 0;
	}
	.stage.on .sheet {
		animation: develop 1.2s var(--ease-expo) forwards;
	}
	/* the contact sheet develops: overexposed and soft, then sharp */
	@keyframes develop {
		from {
			opacity: 0;
			transform: translateY(12px);
			filter: blur(8px) brightness(2);
		}
		to {
			opacity: 1;
			transform: none;
			filter: none;
		}
	}
	.plate-id {
		position: absolute;
		left: 8px;
		right: 8px;
		bottom: 6px;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.08em;
	}
	.frame {
		position: relative;
		aspect-ratio: 145.5 / 174;
		background: url('/me.png') calc(var(--f) * 33.333%) 0 / 400% 100% no-repeat;
		filter: grayscale(1) contrast(1.5) brightness(1.05);
		border: 1.5px solid var(--ink);
	}
	:global(:root:not([data-theme='light'])) .frame {
		filter: grayscale(1) contrast(1.4) sepia(1) hue-rotate(75deg) saturate(3.5) brightness(0.95);
	}
	.dots-ht {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(circle, rgba(0, 0, 0, 0.5) 0.9px, transparent 1.3px);
		background-size: 4px 4px;
		mix-blend-mode: multiply;
	}
	.sheet:hover .frame {
		animation: shuffle 0.6s steps(4) infinite;
		animation-delay: calc(var(--f) * -0.15s);
	}
	@keyframes shuffle {
		from {
			background-position-x: 0%;
		}
		to {
			background-position-x: 133.333%;
		}
	}
	.flash {
		position: absolute;
		inset: 0;
		background: #fff;
		opacity: 0;
		pointer-events: none;
	}
	.sheet:hover .flash {
		animation: flash 0.35s steps(2);
	}
	@keyframes flash {
		from {
			opacity: 0.95;
		}
		to {
			opacity: 0;
		}
	}

	.callout {
		position: absolute;
		display: flex;
		align-items: center;
		gap: 6px;
		transform: translate(-50%, -50%);
		opacity: 0;
		z-index: 3;
		pointer-events: none;
	}
	.stage.on .callout {
		animation: annotate 0.7s var(--ease-expo) forwards;
	}
	.stage.on .callout.right {
		animation-delay: 1.7s;
	}
	.stage.on .callout.left {
		animation-delay: 2s;
	}
	@keyframes annotate {
		from {
			opacity: 0;
			clip-path: inset(0 100% 0 0);
		}
		to {
			opacity: 1;
			clip-path: inset(-20% -20% -20% -20%);
		}
	}
	.hand {
		font-family: var(--font-hand);
		font-size: clamp(1.05rem, 1.8vw, 1.5rem);
		line-height: 1.05;
		background: var(--bg-raised);
		padding: 0 4px;
		white-space: nowrap;
	}
	.hand.small,
	.small {
		font-size: clamp(0.8rem, 1.2vw, 1rem);
	}
	.arrow {
		width: 38px;
		height: 30px;
		overflow: visible;
	}
	.arrow path {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.5;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
	}
	.arrow circle {
		fill: var(--ink);
	}
	.stage.on .arrow path {
		animation: draw 0.6s ease-out forwards;
		animation-delay: 2.1s;
	}

	.node {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		transform: translate(-50%, -50%);
		text-decoration: none;
		z-index: 4;
		opacity: 0;
	}
	.stage.on .node {
		animation: node-in 0.9s var(--ease-expo) forwards;
		animation-delay: calc(700ms + var(--i) * 150ms);
	}
	@keyframes node-in {
		from {
			opacity: 0;
			transform: translate(-50%, -38%);
			filter: blur(6px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
	}
	.node:hover {
		background: none;
		color: var(--ink);
	}
	.lbl {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 6px;
		padding: 2px 8px;
		background: var(--bg-raised);
		border: 2px solid var(--ink);
		font-weight: 700;
		font-size: clamp(0.72rem, 1vw, 0.86rem);
		white-space: nowrap;
		box-shadow: 3px 3px 0 var(--ink);
	}
	.node.hot .lbl {
		background: var(--ink);
		color: var(--bg);
	}
	kbd {
		font-family: var(--font-mono);
		font-size: 0.7em;
		padding: 0 4px;
		border: 1.5px solid currentColor;
	}
	.sub {
		margin-top: 3px;
		font-size: 0.7rem;
		color: var(--muted);
		white-space: nowrap;
	}
	.ls {
		position: absolute;
		top: 100%;
		left: 50%;
		margin-top: 8px;
		display: flex;
		flex-direction: column;
		min-width: 250px;
		padding: 8px 12px;
		background: var(--ink);
		color: var(--bg);
		font-size: 0.72rem;
		line-height: 1.5;
		white-space: pre;
		box-shadow: 4px 4px 0 var(--line-soft);
		animation: ls-in 0.45s var(--ease-expo) both;
		z-index: 10;
	}
	.ls {
		transform: translateX(-50%);
	}
	.ls.start {
		left: 0;
		transform: none;
	}
	.ls.end {
		left: auto;
		right: 0;
		transform: none;
	}
	.ls.up {
		top: auto;
		bottom: 100%;
		margin: 0 0 8px;
	}
	.ls-cmd {
		font-weight: 700;
		opacity: 0.7;
	}
	@keyframes ls-in {
		from {
			clip-path: inset(0 0 100% 0);
		}
		to {
			clip-path: inset(0 0 0 0);
		}
	}

	/* ============ tree (mobile) ============ */
	.tree {
		display: none;
	}
	@media (max-width: 820px) {
		.stage {
			display: none;
		}
		.tree {
			display: block;
			visibility: hidden;
			margin-top: 12px;
		}
		.tree.on {
			visibility: visible;
		}
	}
	.tree-me {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 14px;
	}
	.sheet.mini {
		width: 118px;
		flex: none;
		padding: 5px 5px 16px;
		gap: 4px;
	}
	.tree.on .sheet.mini {
		animation: develop 1.2s var(--ease-expo) forwards;
	}
	.tree-me .hand {
		white-space: normal;
	}
	.tree-root {
		margin: 0;
		font-weight: 700;
	}
	.tree ul {
		list-style: none;
		margin: 0 0 0 6px;
		padding: 0;
		border-left: 2px solid var(--ink);
	}
	.tree li:last-child {
		background: linear-gradient(var(--bg-raised), var(--bg-raised)) -2px 50% / 2px 50% no-repeat;
	}
	.tree li {
		display: flex;
		align-items: center;
		gap: 8px;
		opacity: 0;
	}
	.tree.on li {
		animation: pop-row 0.6s var(--ease-expo) forwards;
		animation-delay: calc(var(--i) * 90ms);
	}
	@keyframes pop-row {
		from {
			transform: translateX(-8px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.branch {
		flex: none;
		width: 22px;
		height: 2px;
		background: var(--ink);
	}
	.tree a {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		padding: 2px 6px 2px 0;
		font-size: 0.86rem;
		line-height: 1.2;
	}

	.statusbar {
		display: flex;
		align-items: center;
		gap: 12px;
		border-top: 2px solid var(--ink);
		font-size: 0.72rem;
		font-weight: 700;
		overflow: hidden;
		white-space: nowrap;
	}
	.mode {
		padding: 3px 10px;
		background: var(--ink);
		color: var(--bg);
	}
	.path {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.hint {
		padding-right: 10px;
		color: var(--muted);
		font-weight: 400;
	}
	@media (max-width: 820px) {
		.hint {
			display: none;
		}
	}
</style>
