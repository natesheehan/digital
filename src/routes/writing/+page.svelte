<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import { onMount, tick } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { publications, outputTypes, typeLabel, formatCitation, profile } from '$lib/data';
	import type { OutputType, Publication } from '$lib/data';
	import { reveal } from '$lib/actions';

	const openCount = publications.filter((p) => p.openAccess).length;
	const articleCount = publications.filter((p) => p.type === 'article').length;
	const years = publications.map((p) => p.year);
	const filters = [
		{ id: 'all' as const, label: 'All', count: publications.length },
		...outputTypes
			.map((t) => ({ id: t.id, label: t.plural, count: publications.filter((p) => p.type === t.id).length }))
			.filter((f) => f.count > 0)
	];

	let active: OutputType | 'all' = 'all';
	let expanded: Record<string, boolean> = {};
	let showAllAuthors: Record<string, boolean> = {};
	let copied: string | null = null;
	let list: HTMLElement;
	let fill = 0;

	$: shown = active === 'all' ? publications : publications.filter((p) => p.type === active);
	$: groups = [...new Set(shown.map((p) => p.year))]
		.sort((a, b) => b - a)
		.map((year) => ({ year, items: shown.filter((p) => p.year === year) }));

	async function setFilter(id: OutputType | 'all') {
		active = id;
		await tick();
		updateFill();
	}

	/** Long author lists collapse to the first few names plus Sheehan. */
	function visibleAuthors(p: Publication): (string | null)[] {
		if (p.authors.length <= 6 || showAllAuthors[p.title]) return p.authors;
		const head = p.authors.slice(0, 4);
		const me = p.authors.findIndex((a) => a.startsWith('Sheehan'));
		return me >= 4 ? [...head, null, p.authors[me]] : head;
	}

	async function copy(p: Publication) {
		try {
			await navigator.clipboard.writeText(formatCitation(p));
			copied = p.title;
			setTimeout(() => copied === p.title && (copied = null), 1800);
		} catch (e) {
			/* clipboard unavailable */
		}
	}

	function updateFill() {
		if (!list) return;
		const r = list.getBoundingClientRect();
		const anchor = window.innerHeight * 0.6;
		fill = Math.max(0, Math.min(1, (anchor - r.top) / r.height));
	}

	onMount(updateFill);
</script>

<svelte:head>
	<title>Publications · Nathanael Sheehan</title>
</svelte:head>

<svelte:window on:scroll|passive={updateFill} on:resize={updateFill} />

<div class="container">
	<header class="page-head">
		<p class="eyebrow cmd" use:reveal>$ ls -la ~/outputs</p>
		<h1 use:reveal={60}>Papers,<br /><span class="hl">data</span> &amp; <span class="outline">outputs</span></h1>
		<p class="lede" use:reveal={120}>
			Articles, a doctoral thesis, policy recommendations and open datasets on data governance,
			epistemic injustice and research infrastructures. Full record on
			<a href={profile.links.orcid}>ORCID</a>.
		</p>
		<div class="stats" use:reveal={180}>
			<div><strong>{articleCount}</strong><span>journal articles</span></div>
			<div><strong>{publications.length}</strong><span>outputs in total</span></div>
			<div class="oa-stat">
				<strong>{openCount}<small>/{publications.length}</small></strong>
				<span>openly available</span>
				<i class="bar" aria-hidden="true"><b style="--p:{openCount / publications.length}" /></i>
			</div>
			<div><strong>{Math.min(...years)}–{Math.max(...years)}</strong><span>years</span></div>
		</div>
	</header>

	<div class="filters" role="toolbar" aria-label="Filter by output type" use:reveal={220}>
		{#each filters as f}
			<button class="chip" class:on={active === f.id} aria-pressed={active === f.id} on:click={() => setFilter(f.id)}>
				{f.label}<span class="count">{f.count}</span>
			</button>
		{/each}
	</div>

	<div class="timeline" bind:this={list} style="--fill:{fill}">
		<div class="rail" aria-hidden="true"><span /></div>

		{#each groups as group (group.year)}
			<section class="year-group" animate:flip={{ duration: 500, easing: cubicOut }} in:fade={{ duration: 300 }}>
				<h2 class="year">{group.year}</h2>

				{#each group.items as p (p.title)}
					<article
						class="entry"
						animate:flip={{ duration: 500, easing: cubicOut }}
						in:fade={{ duration: 350, delay: 120 }}
						out:fade={{ duration: 150 }}
					>
						<span class="node" class:alt={p.type !== 'article'} aria-hidden="true" />
						<div class="entry-tags">
							<span class="tag type-{p.type}">{typeLabel(p.type)}</span>
							{#if p.openAccess}
								<span class="tag tag-oa"><Icon name="open" /> Open access</span>
							{/if}
							{#if p.licence}<span class="tag">{p.licence}</span>{/if}
						</div>

						<h3><a href={p.url}>{p.title}</a></h3>

						<p class="authors">
							{#each visibleAuthors(p) as a, j}
								{#if a === null}<span class="gap">… </span>{:else if a.startsWith('Sheehan')}<strong>{a}</strong>{:else}{a}{/if}{#if a !== null && j < visibleAuthors(p).length - 1}{', '}{/if}
							{/each}
							{#if p.authors.length > 6}
								<button class="more-authors" on:click={() => (showAllAuthors[p.title] = !showAllAuthors[p.title])}>
									{showAllAuthors[p.title] ? 'show fewer' : `+${p.authors.length - visibleAuthors(p).filter(Boolean).length} more`}
								</button>
							{/if}
						</p>
						<p class="venue"><em>{p.venue}</em>{p.details ? `, ${p.details}` : ''} · {p.year}</p>

						<div class="actions">
							{#if p.abstract}
								<button
									class="btn"
									on:click={() => (expanded[p.title] = !expanded[p.title])}
									aria-expanded={!!expanded[p.title]}
								>
									<span class="plus" class:open={expanded[p.title]} aria-hidden="true" />
									{p.type === 'article' ? 'Abstract' : 'Summary'}
								</button>
							{/if}
							<button class="btn" on:click={() => copy(p)}>
								<Icon name={copied === p.title ? 'check' : 'copy'} />
								{copied === p.title ? 'Copied' : 'Copy citation'}
							</button>
							{#if p.doi}
								<a class="btn doi" href="https://doi.org/{p.doi}">
									<span class="doi-label">DOI</span>
									{p.doi}
								</a>
							{:else}
								<a class="btn" href={p.url}><Icon name="external" /> {p.linkLabel ?? 'View record'}</a>
							{/if}
						</div>

						{#if p.abstract && expanded[p.title]}
							<div class="abstract" transition:slide={{ duration: 450, easing: cubicOut }}>
								<p>{p.abstract}</p>
							</div>
						{/if}
					</article>
				{/each}
			</section>
		{/each}
		<p class="rows">{shown.length} file(s) · 0 paywalls</p>
	</div>
</div>

<style>
	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: 20px 44px;
		margin-top: 36px;
	}
	.stats div {
		display: flex;
		flex-direction: column;
	}
	.stats strong {
		font-family: var(--font-display);
		font-weight: 400;
		font-size: 2.4rem;
		line-height: 1;
	}
	.stats small {
		font-size: 1.1rem;
		color: var(--muted);
	}
	.stats span {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
		margin-top: 6px;
	}
	.oa-stat strong {
		color: var(--ink);
	}
	.bar {
		display: block;
		margin-top: 8px;
		height: 3px;
		width: 100%;
		min-width: 120px;
		background: var(--line);
		border-radius: 2px;
		overflow: hidden;
	}
	.bar b {
		display: block;
		height: 100%;
		background: var(--ink);
		transform-origin: left;
		transform: scaleX(var(--p));
		animation: grow 1.6s var(--ease-out) 0.5s both;
	}
	@keyframes grow {
		from {
			transform: scaleX(0);
		}
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding: 18px 0;
		margin-bottom: 8px;
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
	}
	.chip {
		text-transform: uppercase;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 14px;
		border: 1px solid var(--line-soft);
		background: transparent;
		color: var(--muted);
		font: 400 0.76rem var(--font-mono);
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: all 0.3s var(--ease-out);
	}
	.chip:hover {
		border-color: var(--accent);
		color: var(--accent);
	}
	.chip.on {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--bg);
	}
	.count {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		opacity: 0.7;
	}

	.timeline {
		position: relative;
		padding: 24px 0 120px 36px;
	}
	@media (min-width: 860px) {
		.timeline {
			padding-left: 160px;
		}
	}
	.rail {
		position: absolute;
		top: 0;
		bottom: 80px;
		left: 6px;
		width: 1px;
		background: var(--line);
	}
	@media (min-width: 860px) {
		.rail {
			left: 120px;
		}
	}
	.rail span {
		position: absolute;
		inset: 0;
		background: var(--ink);
		transform-origin: top;
		transform: scaleY(var(--fill));
	}

	.year-group {
		position: relative;
		margin-bottom: 48px;
	}
	.year {
		font-size: clamp(2rem, 4vw, 3rem);
		color: transparent;
		-webkit-text-stroke: 1.5px var(--ink);
		margin-bottom: 8px;
	}
	@media (min-width: 860px) {
		.year {
			position: absolute;
			left: -160px;
			top: 28px;
			width: 100px;
			text-align: right;
			font-size: 1.8rem;
		}
	}

	.entry {
		position: relative;
		padding: 28px 0 32px;
		border-bottom: 1.5px dashed var(--line);
		max-width: 820px;
		background: var(--bg);
	}
	.node {
		position: absolute;
		left: -35px;
		top: 36px;
		width: 11px;
		height: 11px;
		background: var(--bg);
		border: 1.5px solid var(--ink);
		transition: transform 0.4s var(--ease-out), background-color 0.3s;
	}
	.node.alt {
		border-color: var(--ink);
		border-radius: 2px;
		transform: rotate(45deg);
	}
	@media (min-width: 860px) {
		.node {
			left: -44px;
		}
	}
	.entry:hover .node {
		background: var(--ink);
		transform: scale(1.5);
	}
	.entry:hover .node.alt {
		background: var(--ink);
		transform: rotate(45deg) scale(1.5);
	}
	.entry-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.tag:not(.tag-oa):not(.type-article):first-child {
		color: var(--ink);
		border-color: color-mix(in srgb, var(--ink) 40%, transparent);
	}
	h3 {
		margin: 14px 0 12px;
		font-size: clamp(1.6rem, 3vw, 2.3rem);
		line-height: 1;
	}
	h3 a {
		text-decoration: none;
		background-image: linear-gradient(var(--ink), var(--ink));
		background-size: 0% 100%;
		background-position: 0 100%;
		background-repeat: no-repeat;
		transition: background-size 0.6s var(--ease-out), color 0.2s;
	}
	h3 a:hover {
		background-size: 100% 100%;
		background-color: transparent;
		color: var(--bg);
	}
	.authors {
		margin: 0;
		font-size: 0.95rem;
		color: var(--ink-soft);
	}
	.authors strong {
		color: var(--ink);
		font-weight: 600;
	}
	.gap {
		color: var(--muted);
	}
	.more-authors {
		margin-left: 6px;
		padding: 0;
		border: 0;
		background: none;
		font: 0.78rem var(--font-mono);
		color: var(--ink);
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	.venue {
		margin: 4px 0 0;
		font-size: 0.9rem;
		color: var(--muted);
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 20px;
	}
	.actions .btn {
		padding: 7px 14px;
		font-size: 0.82rem;
	}
	.doi {
		font-family: var(--font-mono);
		font-weight: 400;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.doi-label {
		font-weight: 500;
		color: var(--ink);
	}
	.plus {
		position: relative;
		width: 10px;
		height: 10px;
	}
	.plus::before,
	.plus::after {
		content: '';
		position: absolute;
		left: 0;
		top: 4.5px;
		width: 10px;
		height: 1.5px;
		background: currentColor;
		transition: transform 0.4s var(--ease-out);
	}
	.plus::after {
		transform: rotate(90deg);
	}
	.plus.open::after {
		transform: rotate(0deg);
	}
	.abstract {
		overflow: hidden;
	}
	.abstract p {
		margin: 24px 0 0;
		padding: 20px 24px;
		background: var(--bg-raised);
		border: 1px solid var(--line);
		border-left: 2px solid var(--ink);
		border-radius: 0;
		font-family: var(--font-mono);
		font-size: 0.9rem;
		line-height: 1.7;
		color: var(--ink-soft);
		box-shadow: var(--shadow);
	}
</style>
