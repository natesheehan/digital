<script lang="ts">
	export let data;

	$: post = data.post;
</script>

<svelte:head>
	<title>{post.title} · Nathanael Sheehan</title>
	{#if post.description}<meta name="description" content={post.description} />{/if}
	<meta property="og:title" content={post.title} />
	<meta property="og:type" content="article" />
</svelte:head>

<article class="container">
	<header class="post-head">
		<p class="eyebrow cmd"><a href="/blog">$ cat ~/blog/{post.slug}.md</a></p>
		<h1>{post.title}</h1>
		<p class="meta">
			<time datetime={post.date}>{post.dateLabel}</time>
			<span>{post.minutes} min read</span>
			{#each post.tags as t}<span>#{t}</span>{/each}
			{#if post.draft}<span class="draft">draft — not published</span>{/if}
		</p>
	</header>

	<div class="prose">{@html post.html}</div>

	<nav class="pager" aria-label="More posts">
		{#if data.newer}<a href="/blog/{data.newer.slug}" class="newer">← {data.newer.title}</a>{:else}<span />{/if}
		{#if data.older}<a href="/blog/{data.older.slug}" class="older">{data.older.title} →</a>{/if}
	</nav>
	<p class="back"><a class="text-link" href="/blog">← all posts</a></p>
</article>

<style>
	.post-head {
		padding: clamp(48px, 8vw, 96px) 0 clamp(24px, 4vw, 40px);
		max-width: 72ch;
	}
	.post-head .cmd a {
		color: inherit;
		text-decoration: none;
	}
	.post-head .cmd a:hover {
		color: var(--accent);
	}
	h1 {
		margin-top: 16px;
		font-size: clamp(2.6rem, 7vw, 5rem);
		line-height: 0.92;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 16px;
		margin-top: 20px;
		font-size: 0.78rem;
		color: var(--muted);
	}
	.draft {
		color: var(--accent);
	}

	/* ---------- rendered markdown ---------- */
	.prose {
		max-width: 68ch;
		padding-bottom: 40px;
		font-size: 0.95rem;
		line-height: 1.75;
	}
	.prose :global(h2),
	.prose :global(h3),
	.prose :global(h4) {
		margin: 2em 0 0.6em;
		line-height: 1;
	}
	.prose :global(h2) {
		font-size: 2.2rem;
	}
	.prose :global(h3) {
		font-size: 1.7rem;
	}
	.prose :global(h4) {
		font-size: 1.35rem;
	}
	.prose :global(p),
	.prose :global(ul),
	.prose :global(ol),
	.prose :global(blockquote),
	.prose :global(pre),
	.prose :global(table),
	.prose :global(figure) {
		margin: 0 0 1.2em;
	}
	.prose :global(ul),
	.prose :global(ol) {
		padding-left: 2.2ch;
	}
	.prose :global(li) {
		margin: 0.25em 0;
	}
	.prose :global(ul > li::marker) {
		content: '- ';
		color: var(--accent);
	}
	.prose :global(blockquote) {
		padding: 0.2em 0 0.2em 2ch;
		border-left: 2px solid var(--accent);
		color: var(--ink-soft);
	}
	.prose :global(blockquote p:last-child) {
		margin-bottom: 0;
	}
	.prose :global(code) {
		padding: 0.1em 0.35em;
		background: var(--bg-raised);
		border: 1px solid var(--line-soft);
		font-size: 0.88em;
	}
	.prose :global(pre) {
		padding: 14px 16px;
		overflow-x: auto;
		background: var(--bg-raised);
		border: 1px solid var(--line-soft);
		font-size: 0.85rem;
		line-height: 1.5;
	}
	.prose :global(pre code) {
		padding: 0;
		background: none;
		border: 0;
		font-size: inherit;
	}
	.prose :global(img),
	.prose :global(video) {
		display: block;
		max-width: 100%;
		height: auto;
		margin: 1.6em 0;
		border: 1px solid var(--line-soft);
	}
	/* <figure class="ink" style="--src: url(…)"><img …></figure>: a black-on-transparent
	   image redrawn in the theme's ink colour; the img keeps the size and alt text (and is
	   what RSS readers show) */
	.prose :global(figure.ink) {
		width: min(100%, 528px);
		margin: 1.6em 0;
		background: var(--ink);
		-webkit-mask: var(--src) center / contain no-repeat;
		mask: var(--src) center / contain no-repeat;
	}
	.prose :global(figure.ink img) {
		width: 100%;
		margin: 0;
		border: 0;
		opacity: 0;
	}
	.prose :global(hr) {
		margin: 2.4em 0;
		border: 0;
		border-top: 1px dashed var(--line-soft);
	}
	.prose :global(table) {
		display: block;
		overflow-x: auto;
		border-collapse: collapse;
		font-size: 0.85rem;
	}
	.prose :global(th),
	.prose :global(td) {
		padding: 6px 12px;
		border: 1px solid var(--line-soft);
		text-align: left;
	}

	.pager {
		display: flex;
		justify-content: space-between;
		gap: 24px;
		max-width: 68ch;
		padding: 24px 0;
		border-top: 1px solid var(--line-soft);
		font-size: 0.85rem;
	}
	.older {
		margin-left: auto;
		text-align: right;
	}
	.back {
		padding-bottom: 80px;
	}
</style>
