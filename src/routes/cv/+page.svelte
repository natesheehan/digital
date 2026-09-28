<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Bot from '$lib/components/Bot.svelte';
	import { profile } from '$lib/data';
	import { reveal } from '$lib/actions';

	let loaded = false;
</script>

<svelte:head>
	<title>CV · Nathanael Sheehan</title>
</svelte:head>

<div class="container">
	<header class="page-head">
		<p class="eyebrow cmd" use:reveal>$ lpr ~/cv.pdf</p>
		<h1 use:reveal={60}>Curriculum<br /><span class="outline">vitae</span></h1>
		<p class="lede" use:reveal={120}>
			My CV is kept in the open and versioned on GitHub.
		</p>
		<div class="actions" use:reveal={180}>
			<a class="btn btn-primary" href={profile.links.cv} download><Icon name="download" /> Download PDF</a>
			<a class="btn" href={profile.links.cvSource}><Icon name="github" /> Source</a>
			<a class="btn" href={profile.links.orcid}><Icon name="orcid" /> ORCID record</a>
		</div>
	</header>

	<div class="paper-wrap">
		<div class="holder" aria-hidden="true"><Bot delay={500} /></div>
		<div class="paper win" class:loaded use:reveal={240}>
			<div class="winbar"><span>CV.PDF — Acrobat Reader 5.0</span><span class="winbtns" aria-hidden="true"><i>_</i><i>□</i><i>×</i></span></div>
			<div class="doc">
			<div class="skeleton" aria-hidden="true">
				{#each Array(9) as _, i}<span style="--w:{[60, 90, 75, 95, 40, 85, 70, 92, 55][i]}%" />{/each}
			</div>
			<iframe src={profile.links.cv} title="Nathanael Sheehan's CV (PDF)" on:load={() => (loaded = true)} />
			</div>
		</div>
	</div>
</div>

<style>
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 28px;
	}
	.paper-wrap {
		position: relative;
	}
	.holder {
		position: absolute;
		right: 0;
		top: -96px;
		width: 110px;
		height: 110px;
		z-index: 2;
	}
	.paper {
		position: relative;
		margin: 16px 0 clamp(80px, 12vw, 140px);
		height: min(1100px, 85vh);
		display: flex;
		flex-direction: column;
	}
	.doc {
		position: relative;
		flex: 1;
		margin-top: 3px;
		overflow: hidden;
		background: var(--bg-raised);
		box-shadow: inset 1px 1px var(--b-shade);
	}
	iframe {
		position: relative;
		width: 100%;
		height: 100%;
		border: 0;
		opacity: 0;
		transition: opacity 0.6s ease;
	}
	.loaded iframe {
		opacity: 1;
	}
	.skeleton {
		position: absolute;
		inset: 48px;
		display: grid;
		align-content: start;
		gap: 18px;
		transition: opacity 0.4s ease;
	}
	.loaded .skeleton {
		opacity: 0;
	}
	.skeleton span {
		height: 12px;
		width: var(--w);
		border-radius: 3px;
		background: linear-gradient(90deg, var(--line) 0%, var(--bg) 50%, var(--line) 100%);
		background-size: 200% 100%;
		animation: shimmer 1.6s ease-in-out infinite;
	}
	.skeleton span:first-child {
		height: 28px;
	}
	@keyframes shimmer {
		to {
			background-position: -200% 0;
		}
	}
</style>
