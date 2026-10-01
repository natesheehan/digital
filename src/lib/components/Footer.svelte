<script lang="ts">
	import { profile } from '$lib/data';
	import Icon from './Icon.svelte';
</script>

<footer>
	<div class="container">
		<p class="giant" aria-hidden="true">
			<span class="word">{#each 'NATHANAEL'.split('') as ch}<span class="ch">{ch}</span>{/each}</span>
			<span class="word outline">{#each 'SHEEHAN'.split('') as ch}<span class="ch">{ch}</span>{/each}</span>
		</p>

		<div class="grid">
			<p class="addr">
				{profile.about}
			</p>

			<ul class="links">
				<li><a href={profile.links.orcid}><Icon name="orcid" size={14} /> orcid/{profile.orcid}</a></li>
				<li><a href={profile.links.github}><Icon name="github" size={14} /> github/natesheehan</a></li>
				<li><a href={profile.links.gitlab}><Icon name="gitlab" size={14} /> gitlab/natesheehan</a></li>
				<li><a href={profile.links.bluesky}><Icon name="bluesky" size={14} /> bsky/nathanaelsheehan</a></li>
				<li><a href="mailto:{profile.email}"><Icon name="mail" size={14} /> {profile.email}</a></li>
			</ul>
		</div>

		<div class="colophon">
			<span>© {new Date().getFullYear()} {profile.name} · CC-BY 4.0 · no cookies</span>
			<a href={profile.links.source}>view source</a>
		</div>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--line-soft);
		padding: 64px 0 28px;
		overflow: hidden;
	}
	.word {
		display: inline-flex;
	}
	.ch {
		display: inline-block;
		transition: color 0.15s;
	}
	.ch:hover {
		color: var(--accent);
	}
	.outline .ch:hover {
		background-image: repeating-linear-gradient(to bottom, var(--accent) 0 2px, transparent 2px 4px);
	}
	.giant {
		display: flex;
		flex-wrap: wrap;
		gap: 0 0.25em;
		margin: 0 0 48px;
		font-family: var(--font-display);
		font-size: clamp(3.6rem, 13vw, 11rem);
		line-height: 0.82;
	}
	.grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 32px;
	}
	.addr {
		margin: 0;
		font-size: 0.75rem;
		line-height: 1.7;
		color: var(--muted);
		max-width: 420px;
	}
	.links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 4px;
	}
	.links a {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-size: 0.82rem;
		text-decoration: none;
		overflow-wrap: anywhere;
	}

	.colophon {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px;
		margin-top: 56px;
		padding-top: 16px;
		border-top: 1px solid var(--line-soft);
		font-size: 0.7rem;
		letter-spacing: 0.04em;
		color: var(--muted);
	}
	.colophon a {
		color: var(--muted);
	}
</style>
