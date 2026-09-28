<script lang="ts">
	import { onMount } from 'svelte';
	import { profile } from '$lib/data';
	import Icon from './Icon.svelte';

	/** An honest hit counter: it only counts this browser's visits. */
	let visits = '------';

	onMount(() => {
		try {
			const n = Number(localStorage.getItem('visits') || '0') + 1;
			localStorage.setItem('visits', String(n));
			visits = String(n).padStart(6, '0');
		} catch (e) {
			visits = '000001';
		}
	});

	const badges = [
		{ a: 'OPEN', b: 'ACCESS', href: profile.links.orcid },
		{ a: 'ORCID', b: 'iD', href: profile.links.orcid },
		{ a: 'MADE W/', b: 'SVELTE', href: profile.links.source },
		{ a: 'GIT', b: 'HUB', href: profile.links.github },
		{ a: 'CC', b: 'BY 4.0', href: 'https://creativecommons.org/licenses/by/4.0/' },
		{ a: 'ANY', b: 'BROWSER', href: 'https://anybrowser.org/campaign/' }
	];
</script>

<footer>
	<div class="container">
		<p class="giant" aria-hidden="true">
			<span class="word">{#each 'NATHANAEL'.split('') as ch}<span class="ch">{ch}</span>{/each}</span>
			<span class="word outline">{#each 'SHEEHAN'.split('') as ch}<span class="ch">{ch}</span>{/each}</span>
		</p>

		<div class="grid">
			<p class="addr">
				{profile.role}<br />{profile.chair}<br />{profile.institution}
			</p>

			<ul class="links">
				<li><a href={profile.links.orcid}><Icon name="orcid" size={15} /> orcid/{profile.orcid}</a></li>
				<li><a href={profile.links.github}><Icon name="github" size={15} /> github/natesheehan</a></li>
				<li><a href={profile.links.twitter}><Icon name="twitter" size={15} /> x/thanaelsheehan</a></li>
				<li><a href="mailto:{profile.email}"><Icon name="mail" size={15} /> {profile.email}</a></li>
			</ul>
		</div>

		<div class="retro">
			<div class="counter" title="Visits from this browser only — no tracking">
				<span class="lbl">YOUR VISIT No.</span>
				<span class="digits">{#each visits.split('') as d}<b>{d}</b>{/each}</span>
			</div>

			<nav class="ring" aria-label="Webring">
				<a href={profile.links.orcid}>« prev</a>
				<span>☆ OPEN SCIENCE WEBRING ☆</span>
				<a href={profile.links.github}>next »</a>
			</nav>

			<ul class="badges">
				{#each badges as b}
					<li><a href={b.href} class="badge"><span class="ba">{b.a}</span><span class="bb">{b.b}</span></a></li>
				{/each}
			</ul>
		</div>

		<div class="colophon">
			<span>© 1999–{new Date().getFullYear()} {profile.name} · no cookies were harmed</span>
			<span>Best viewed in Netscape Navigator 4.0 at 800×600 (or any browser) · <a href={profile.links.source}>view source</a></span>
		</div>
	</div>
</footer>

<style>
	footer {
		border-top: 2px dashed var(--line-soft);
		padding: 48px 0 28px;
		overflow: hidden;
	}
	.word {
		display: inline-flex;
	}
	.ch {
		display: inline-block;
	}
	.ch:hover {
		background: var(--ink);
		color: var(--bg);
		text-shadow: none;
	}
	.outline .ch:hover {
		background: var(--ink);
		-webkit-background-clip: border-box;
		background-clip: border-box;
		color: var(--bg);
	}
	.giant {
		display: flex;
		flex-wrap: wrap;
		gap: 0 0.25em;
		margin: 0 0 40px;
		font-family: var(--font-display);
		font-size: clamp(4rem, 16vw, 14rem);
		line-height: 0.8;
	}
	.grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 32px;
	}
	.addr {
		margin: 0;
		padding: 10px 14px;
		border: 1px dashed var(--ink);
		font-size: 0.75rem;
		line-height: 1.6;
		text-transform: uppercase;
		max-width: 420px;
		align-self: flex-start;
	}
	.links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 6px;
	}
	.links a {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-size: 0.85rem;
		overflow-wrap: anywhere;
		padding: 0 4px;
		margin-left: -4px;
	}

	.retro {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 20px 32px;
		margin-top: 44px;
	}
	.counter {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: var(--font-pixel);
		font-size: 0.5rem;
	}
	.digits {
		display: inline-flex;
		gap: 2px;
		padding: 3px;
		background: #000;
		box-shadow: inset 1px 1px var(--b-shade), inset -1px -1px var(--b-light);
	}
	.digits b {
		display: grid;
		place-items: center;
		width: 16px;
		height: 22px;
		font-family: var(--font-display);
		font-size: 1.3rem;
		font-weight: 400;
		color: #ff3b3b;
		background: linear-gradient(#1a0000 49%, #000 49% 51%, #1a0000 51%);
		text-shadow: 0 0 6px rgb(255 59 59 / 0.7);
	}
	.ring {
		display: flex;
		align-items: center;
		gap: 12px;
		font-family: var(--font-display);
		font-size: 1.3rem;
	}
	.badges {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	/* 88×31, as the law requires */
	.badge,
	.badge:visited {
		display: flex;
		width: 88px;
		height: 31px;
		border: 1px solid var(--ink);
		font-family: var(--font-mono);
		font-size: 9px;
		font-weight: 700;
		line-height: 1;
		text-decoration: none;
		text-shadow: none;
		color: var(--ink);
		overflow: hidden;
	}
	.ba {
		display: grid;
		place-items: center;
		width: 44%;
		background: var(--ink);
		color: var(--bg);
	}
	.bb {
		display: grid;
		place-items: center;
		flex: 1;
		background: repeating-linear-gradient(to bottom, var(--bg-raised) 0 2px, var(--bg) 2px 3px);
	}
	.badge:hover {
		background: none;
		outline: 1px dotted var(--ink);
		outline-offset: 2px;
	}
	.badge:hover .bb {
		background: var(--accent);
		color: var(--bg);
	}

	.colophon {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px;
		margin-top: 32px;
		padding-top: 14px;
		border-top: 1px dashed var(--line);
		font-size: 0.72rem;
		text-transform: uppercase;
		color: var(--muted);
	}
</style>
