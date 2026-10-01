<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';

	const nav = [
		{ href: '/', label: 'home' },
		{ href: '/writing', label: 'outputs' },
		{ href: '/projects', label: 'software' },
		{ href: '/cv', label: 'cv' }
	];

	let open = false;
	let dark = true;
	let scrolled = false;
	let progress = 0;
	let clock = '--:--';

	$: path = $page.url.pathname;
	$: path, (open = false);
	$: cwd = path === '/' ? '~' : `~${path.replace(/\/$/, '')}`;

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
	<div class="bar container">
		<a href="/" class="prompt" aria-label="Nathanael Sheehan, home">
			<span class="user">nsheehan</span><span class="cwd">:{cwd}</span><span class="sigil">$</span><span class="caret" aria-hidden="true" />
		</a>

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
			</button>
			<span class="clock" title="Munich time">MUC {clock}</span>
			<button class="tray-btn menu-btn" on:click={() => (open = !open)} aria-expanded={open} aria-label="Menu">
				<Icon name={open ? 'close' : 'menu'} size={16} />
			</button>
		</div>
	</div>
	<div class="progress" style="transform: scaleX({progress})" />
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: color-mix(in srgb, var(--bg) 82%, transparent);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s;
	}
	header.scrolled {
		border-bottom-color: var(--line-soft);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 24px;
		height: 56px;
	}
	.prompt,
	.prompt:visited {
		display: flex;
		align-items: center;
		font-size: 0.82rem;
		color: var(--ink);
		text-decoration: none;
		white-space: nowrap;
	}
	.prompt:hover {
		color: var(--ink);
	}
	.cwd {
		color: var(--muted);
	}
	.sigil {
		margin-left: 0.15em;
		color: var(--accent);
	}
	.caret {
		display: inline-block;
		width: 0.55em;
		height: 1.05em;
		margin-left: 0.45em;
		background: var(--ink);
		opacity: 0;
	}
	.prompt:hover .caret,
	.prompt:focus-visible .caret {
		opacity: 1;
		animation: blink 1.1s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	nav {
		flex: 1;
		min-width: 0;
	}
	nav ul {
		display: flex;
		justify-content: flex-end;
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
		padding: 0 10px;
		font-size: 0.8rem;
		text-decoration: none;
		color: var(--muted);
	}
	.task::before {
		content: '/';
		margin-right: 1px;
		opacity: 0.5;
	}
	.task:hover {
		color: var(--ink);
	}
	.task.active {
		color: var(--ink);
	}
	.task.active::before {
		content: '>';
		opacity: 1;
		color: var(--accent);
	}

	.tray {
		display: flex;
		align-items: center;
		gap: 14px;
		padding-left: 18px;
		border-left: 1px solid var(--line-soft);
		height: 20px;
	}
	.tray-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
		transition: color 0.15s;
	}
	.tray-btn:hover {
		color: var(--accent);
	}
	.clock {
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		font-variant-numeric: tabular-nums;
		color: var(--muted);
	}
	.menu-btn {
		display: none;
	}

	.progress {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -1px;
		height: 1px;
		background: var(--accent);
		transform-origin: left;
	}

	@media (max-width: 860px) {
		.clock {
			display: none;
		}
	}
	@media (max-width: 420px) {
		.cwd {
			display: none;
		}
	}
	@media (max-width: 640px) {
		.bar {
			gap: 12px;
		}
		.tray {
			margin-left: auto;
		}
		.menu-btn {
			display: inline-flex;
		}
		nav {
			position: absolute;
			top: 56px;
			left: 0;
			right: 0;
			background: var(--bg);
			border-bottom: 1px solid var(--line-soft);
			clip-path: inset(0 0 100% 0);
			transition: clip-path 0.3s var(--ease-out);
		}
		header.open nav {
			clip-path: inset(0 0 -1px 0);
		}
		nav ul {
			flex-direction: column;
			padding: 8px var(--gutter) 16px;
		}
		.task {
			height: 44px;
			font-size: 0.95rem;
		}
	}
</style>
