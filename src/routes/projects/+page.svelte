<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Cover from '$lib/components/Cover.svelte';
	import Bot from '$lib/components/Bot.svelte';
	import { software, profile, slug } from '$lib/data';
	import { reveal } from '$lib/actions';
</script>

<svelte:head>
	<title>Research software · Nathanael Sheehan</title>
</svelte:head>

<div class="container">
	<header class="page-head">
		<p class="eyebrow cmd" use:reveal>$ ls -l ~/software</p>
		<h1 use:reveal={60}>Open code<br />for <span class="hl">open</span> questions</h1>
		<p class="lede" use:reveal={120}>
			R packages, data packages and interactive platforms built alongside my research. The source
			for each is on <a href={profile.links.github}>GitHub</a> — issues and pull requests welcome.
		</p>
	</header>

	<div class="projects">
		{#each software as s, i}
			<article class="project" class:flip={i % 2 === 1} id={slug(s.name)} use:reveal>
				<div class="media win">
					<div class="winbar"><span>{s.name.toUpperCase()}.{s.media?.type === 'video' ? 'AVI' : 'BMP'}</span><span class="winbtns" aria-hidden="true"><i>_</i><i>□</i><i>×</i></span></div>
					<div class="media-inner">
					{#if s.media?.type === 'video'}
						<video src={s.media.src} autoplay muted loop playsinline aria-label={s.media.alt} />
					{:else if s.media?.type === 'image'}
						<img src={s.media.src} alt={s.media.alt} loading="lazy" decoding="async" />
					{:else}
						<Cover variant={s.cover} seed={s.name} />
					{/if}
					<span class="index">{String(i + 1).padStart(2, '0')} / {String(software.length).padStart(2, '0')}</span>
					</div>
				</div>

				<div class="presenter" aria-hidden="true"><Bot delay={300} /></div>
				<div class="info">
					<span class="eyebrow">{s.kind}</span>
					<h2>{s.name}</h2>
					<p class="summary">{s.summary}</p>
					<p class="desc">{s.description}</p>
					<ul class="tags">
						{#each s.tags as t}<li class="tag">{t}</li>{/each}
					</ul>
					<div class="links">
						<a class="btn btn-primary" href={s.site}>Visit <Icon name="external" /></a>
						<a class="btn" href={s.repo}><Icon name="github" /> Source</a>
					</div>
				</div>
			</article>
		{/each}
	</div>
</div>

<style>
	.projects {
		display: grid;
		gap: clamp(56px, 9vw, 112px);
		padding: 24px 0 clamp(80px, 12vw, 140px);
	}
	.project {
		display: grid;
		gap: 28px;
		grid-template-columns: minmax(0, 1fr);
		align-items: center;
		scroll-margin-top: 96px;
	}
	@media (min-width: 900px) {
		.project {
			grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
			gap: 56px;
		}
		.project.flip .media {
			order: 2;
		}
	}
	.media {
		position: relative;
	}
	.media-inner {
		position: relative;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background: var(--bg-raised);
		box-shadow: inset 1px 1px var(--b-shade);
	}
	.media video,
	.media img,
	.media :global(svg) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(1) contrast(1.2);
		transition: transform 1.4s var(--ease-out);
	}

	.project {
		position: relative;
	}
	:global(:root:not([data-theme='light'])) .media video,
	:global(:root:not([data-theme='light'])) .media img {
		filter: grayscale(1) contrast(1.3) sepia(1) hue-rotate(75deg) saturate(3) brightness(0.9);
	}
	.presenter {
		display: none;
	}
	@media (min-width: 900px) {
		.presenter {
			display: block;
			position: absolute;
			left: -110px;
			bottom: -10px;
			width: 110px;
			height: 110px;
			z-index: 2;
		}
		.project.flip .presenter {
			left: auto;
			right: calc(45% - 150px);
			transform: scaleX(-1);
		}
	}
	.index {
		position: absolute;
		left: 12px;
		bottom: 12px;
		padding: 3px 8px;
		background: var(--ink);
		color: var(--bg);
		text-shadow: none;
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}
	h2 {
		margin: 8px 0 12px;
		font-size: clamp(2.6rem, 5vw, 3.8rem);
	}
	.summary {
		font-weight: 700;
		font-size: 1.05rem;
		line-height: 1.5;
		color: var(--ink);
	}
	.desc {
		font-size: 0.95rem;
		color: var(--ink-soft);
	}
	.tags {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 20px 0 0;
		padding: 0;
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 24px;
	}
</style>
