<script lang="ts">
	import { reveal } from '$lib/actions';

	export let data;
</script>

<svelte:head>
	<title>Blog · Nathanael Sheehan</title>
	<link rel="alternate" type="application/rss+xml" title="Nathanael Sheehan — blog" href="/blog/rss.xml" />
</svelte:head>

<div class="container">
	<header class="page-head">
		<p class="eyebrow cmd" use:reveal>$ ls -t ~/blog</p>
		<h1 use:reveal={60}>The <span class="hl">blog</span></h1>
		<p class="lede" use:reveal={120}>
			Shorter, looser writing on data, standards, open science and whatever I'm building.
			<a href="/blog/rss.xml">RSS feed</a>.
		</p>
	</header>

	{#if data.posts.length}
		<ul class="posts">
			{#each data.posts as p, i}
				<li use:reveal={i * 60}>
					<a class="post" href="/blog/{p.slug}">
						<time datetime={p.date}>{p.dateLabel}</time>
						<span class="body">
							<span class="title">{p.title}{#if p.draft}<span class="draft">draft</span>{/if}</span>
							{#if p.description}<span class="desc">{p.description}</span>{/if}
							<span class="meta">{p.minutes} min read{#each p.tags as t}<span class="tag">#{t}</span>{/each}</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
		<p class="rows">{data.posts.length} file(s)</p>
	{:else}
		<p class="empty">total 0 — nothing here yet.</p>
	{/if}
</div>

<style>
	.posts {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line-soft);
	}
	.posts li {
		border-bottom: 1px solid var(--line-soft);
	}
	.post,
	.post:visited {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 6px 24px;
		padding: 22px 0;
		color: var(--ink);
		text-decoration: none;
	}
	@media (min-width: 720px) {
		.post {
			grid-template-columns: 120px minmax(0, 1fr);
		}
	}
	.post:hover .title {
		color: var(--accent);
	}
	time {
		padding-top: 6px;
		font-size: 0.78rem;
		color: var(--muted);
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.title {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		line-height: 1;
		transition: color 0.15s;
	}
	.desc {
		max-width: 64ch;
		font-size: 0.88rem;
		color: var(--ink-soft);
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
		font-size: 0.74rem;
		color: var(--muted);
	}
	.draft {
		margin-left: 12px;
		padding: 0 6px;
		border: 1px solid var(--accent);
		color: var(--accent);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		vertical-align: middle;
	}
	.empty {
		padding: 22px 0 80px;
		border-top: 1px solid var(--line-soft);
		color: var(--muted);
	}
</style>
