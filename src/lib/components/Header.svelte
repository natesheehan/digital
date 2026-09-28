<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import Bot from './Bot.svelte';
	import { publications, software } from '$lib/data';

	const nav = [
		{ href: '/', label: 'HOME.HTM' },
		{ href: '/writing', label: 'OUTPUTS' },
		{ href: '/projects', label: 'SOFTWARE' },
		{ href: '/cv', label: 'CV.PDF' }
	];

	const latest = publications[0];
	const ticker = [
		`WELCOME TO NATE'S HOMEPAGE ON THE INFORMATION SUPERHIGHWAY`,
		`NEW! "${latest.title.toUpperCase()}" (${latest.year})`,
		`${publications.filter((p) => p.openAccess).length}/${publications.length} OUTPUTS OPEN ACCESS`,
		`${software.length} OPEN-SOURCE PROJECTS ON GITHUB`,
		`NOW 100% FREE OF PAYWALLS`,
		`PLAY NATE QUEST BELOW`,
		`SIGN MY GUESTBOOK (IT'S AN EMAIL)`
	].join('   ★   ');

	let open = false;
	let dark = true;
	let scrolled = false;
	let progress = 0;
	let clock = '--:--';

	$: path = $page.url.pathname;
	$: path, (open = false);

	function isActive(href: string, current: string) {
		return href === '/' ? current === '/' : current.startsWith(href);
	}

	function toggleTheme() {
		dark = document.documentElement.dataset.theme === 'light';
		const next = dark ? 'dark' : 'light';
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem('theme', next);
		} catch (e) {
			/* storage unavailable */
		}
	}

	function onScroll() {
		scrolled = window.scrollY > 8;
		const max = document.documentElement.scrollHeight - window.innerHeight;
		progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
	}

	onMount(() => {
		dark = document.documentElement.dataset.theme !== 'light';
		onScroll();
		const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' });
		const tickClock = () => (clock = fmt.format(new Date()));
		tickClock();
		const id = setInterval(tickClock, 10000);
		return () => clearInterval(id);
	});
</script>

<svelte:window on:scroll|passive={onScroll} on:resize={onScroll} />

<header class:scrolled class:open>
	<div class="taskbar bevel">
		<a href="/" class="start" aria-label="Nathanael Sheehan, home">
			<span class="buddy" aria-hidden="true"><Bot instant /></span>
			<span class="name">N.SHEEHAN<span class="ext">.EXE</span></span>
		</a>
		<span class="sep" aria-hidden="true" />

		<nav aria-label="Primary">
			<ul>
				{#each nav as item}
					<li>
						<a
							href={item.href}
							class="task"
							class:active={isActive(item.href, path)}
							aria-current={isActive(item.href, path) ? 'page' : undefined}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="tray">
			<button class="tray-btn" on:click={toggleTheme} aria-label={dark ? 'Switch to printout theme' : 'Switch to CRT theme'}>
				<Icon name={dark ? 'sun' : 'moon'} size={14} />
				<span class="mode">{dark ? 'CRT' : 'PRN'}</span>
			</button>
			<span class="clock" title="Munich time">{clock}</span>
			<button class="tray-btn menu-btn" on:click={() => (open = !open)} aria-expanded={open} aria-label="Menu">
				<Icon name={open ? 'close' : 'menu'} size={16} />
			</button>
		</div>
	</div>

	<div class="marquee" aria-hidden="true">
		<div class="track">
			<span>{ticker}   ★   </span><span>{ticker}   ★   </span>
		</div>
	</div>
	<div class="progress" style="transform: scaleX({progress})" />
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: var(--bg);
		text-shadow: none;
	}
	.taskbar {
		display: flex;
		align-items: center;
		gap: 4px;
		height: 40px;
		padding: 4px 4px;
	}
	.start,
	.start:visited {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 30px;
		padding: 0 10px 0 6px;
		text-decoration: none;
		color: var(--ink);
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.8rem;
		background: var(--face);
		box-shadow: inset -1px -1px var(--b-dark), inset 1px 1px var(--b-light), inset -2px -2px var(--b-shade),
			inset 2px 2px var(--b-soft);
	}
	:global(:root[data-theme='light']) .start {
		color: #000;
	}
	.start:hover {
		background: var(--face);
		color: var(--ink);
	}
	:global(:root[data-theme='light']) .start:hover {
		color: #000;
	}
	.start:active {
		box-shadow: inset -1px -1px var(--b-light), inset 1px 1px var(--b-dark), inset -2px -2px var(--b-soft),
			inset 2px 2px var(--b-shade);
	}
	.buddy {
		width: 24px;
		height: 24px;
	}
	.ext {
		font-weight: 400;
		opacity: 0.7;
	}
	.sep {
		width: 2px;
		height: 28px;
		margin: 0 4px;
		box-shadow: inset 1px 0 var(--b-shade), inset -1px 0 var(--b-light);
	}

	nav {
		flex: 1;
		min-width: 0;
	}
	nav ul {
		display: flex;
		gap: 4px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.task,
	.task:visited {
		display: flex;
		align-items: center;
		height: 30px;
		min-width: 110px;
		padding: 0 12px;
		font-family: var(--font-mono);
		font-size: 0.76rem;
		font-weight: 700;
		text-decoration: none;
		color: var(--ink);
		background: var(--face);
		box-shadow: inset -1px -1px var(--b-dark), inset 1px 1px var(--b-light), inset -2px -2px var(--b-shade),
			inset 2px 2px var(--b-soft);
	}
	:global(:root[data-theme='light']) .task {
		color: #000;
	}
	.task:hover {
		background: var(--face);
		color: var(--ink);
		outline: 1px dotted currentColor;
		outline-offset: -5px;
	}
	:global(:root[data-theme='light']) .task:hover {
		color: #000;
	}
	/* the active window's task button is pressed in, with the checkerboard fill */
	.task.active {
		box-shadow: inset -1px -1px var(--b-light), inset 1px 1px var(--b-dark), inset -2px -2px var(--b-soft),
			inset 2px 2px var(--b-shade);
		background: repeating-conic-gradient(var(--face) 0 25%, var(--b-soft) 0 50%) 0 0 / 2px 2px;
	}
	:global(:root:not([data-theme='light'])) .task.active {
		background: var(--line-soft);
	}

	.tray {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 6px;
		height: 30px;
		padding: 0 6px;
		box-shadow: inset 1px 1px var(--b-shade), inset -1px -1px var(--b-light);
	}
	.tray-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 22px;
		padding: 0 6px;
		border: 0;
		background: transparent;
		color: var(--ink);
		font: 700 0.68rem var(--font-mono);
		cursor: pointer;
	}
	:global(:root[data-theme='light']) .tray-btn,
	:global(:root[data-theme='light']) .clock {
		color: #000;
	}
	.tray-btn:hover {
		outline: 1px dotted currentColor;
	}
	.clock {
		font-size: 0.72rem;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}
	.menu-btn {
		display: none;
	}

	.marquee {
		overflow: hidden;
		border-bottom: 1px solid var(--line-soft);
		background: var(--bg);
		font-family: var(--font-display);
		font-size: 1.05rem;
		line-height: 22px;
		color: var(--accent);
		white-space: pre;
	}
	:global(:root:not([data-theme='light'])) .marquee {
		text-shadow: 0 0 6px rgb(255 176 0 / 0.5);
	}
	.track {
		display: inline-flex;
		animation: scroll 70s linear infinite;
	}
	.marquee:hover .track {
		animation-play-state: paused;
	}
	@keyframes scroll {
		to {
			transform: translateX(-50%);
		}
	}

	.progress {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -4px;
		height: 3px;
		background: repeating-linear-gradient(90deg, var(--ink) 0 8px, transparent 8px 10px);
		transform-origin: left;
	}

	@media (max-width: 860px) {
		.name .ext,
		.clock {
			display: none;
		}
		.task {
			min-width: 0;
		}
	}
	@media (max-width: 640px) {
		.menu-btn {
			display: inline-flex;
		}
		nav {
			position: absolute;
			top: 64px;
			left: 0;
			right: 0;
			background: var(--face);
			box-shadow: inset -1px -1px var(--b-dark), inset 1px 1px var(--b-light);
			clip-path: inset(0 0 100% 0);
			transition: clip-path 0.3s steps(6);
		}
		header.open nav {
			clip-path: inset(0 0 0 0);
		}
		nav ul {
			flex-direction: column;
			padding: 8px;
		}
		.task {
			height: 40px;
			font-size: 0.9rem;
		}
	}
</style>
