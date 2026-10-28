<script lang="ts">
	import Bot from '$lib/components/Bot.svelte';
	import HeroTerminal from '$lib/components/HeroTerminal.svelte';
	import Notebook from '$lib/components/Notebook.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Cover from '$lib/components/Cover.svelte';
	import { profile, publications, software, softwareGroups, slug, typeLabel } from '$lib/data';
	import { reveal, scramble } from '$lib/actions';

	const selected = publications.slice(0, 5);
	const swGroups = softwareGroups.map((g) => ({ ...g, items: software.filter((s) => s.group === g.id) }));

	const contactLines = [
		{ text: 'GOT AN IDEA?', outline: false },
		{ text: "LET'S MAKE", outline: false },
		{ text: 'SOMETHING', outline: true },
		{ text: 'OPEN.', outline: false }
	];
</script>

<svelte:head>
	<title>Nathanael Sheehan</title>
</svelte:head>

<!-- ============================ HERO ============================ -->
<section class="hero">
	<div class="container">
		<HeroTerminal />
	</div>
</section>

<!-- ============================ ABOUT ============================ -->
<section class="section" id="notebook">
	<div class="container">
		<div class="section-head" use:reveal>
			<span class="section-num">$ vim notebook/</span>
			<h2 class="section-title">Get to <span class="hl">know</span> me</h2>
		</div>
		<div use:reveal={80}><Notebook /></div>
	</div>
</section>

<!-- ============================ OUTPUTS ============================ -->
<section class="section" id="publications">
	<div class="container">
		<div class="section-head" use:reveal>
			<span class="section-num">$ ls -t outputs | head -5</span>
			<h2 class="section-title">Recent <span class="hl">outputs</span></h2>
		</div>

		<ul class="pubs">
			{#each selected as p, i}
				<li use:reveal={i * 60}>
					<a href={p.url} class="pub">
						<span class="pub-year">{p.year}</span>
						<span class="pub-body">
							<span class="pub-title">{p.title}</span>
							<span class="pub-venue">{typeLabel(p.type)} · <em>{p.venue}</em>{p.details && p.type === 'article' ? `, ${p.details}` : ''}</span>
						</span>
						<span class="pub-tags">
							{#if p.openAccess}<span class="tag tag-oa"><Icon name="open" /> OA</span>{/if}
							<span class="pub-arrow">↗</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
		<p class="rows">5 file(s) · {publications.length - 5} more in outputs/</p>
		<a class="text-link more" href="/writing">All {publications.length} outputs: articles, thesis, reports &amp; data →</a>
	</div>
</section>

<!-- ============================ SOFTWARE ============================ -->
<section class="section" id="software">
	<div class="container">
		<div class="section-head" use:reveal>
			<span class="section-num">$ ls software/</span>
			<h2 class="section-title">Free and Open Source <span class="hl">Software</span></h2>
		</div>

		{#each swGroups as g}
		<p class="sw-group"><a href="/software#{g.dir}">{g.dir}/</a> <span>{g.label} · {g.items.length}</span></p>
		<div class="sw-grid">
			{#each g.items as s, i}
				<a class="sw win" href="/software#{slug(s.name)}" use:reveal={i * 70}>
					<div class="sw-cover">
							{#if s.media?.type === 'video'}
								<video src={s.media.src} autoplay muted loop playsinline aria-label={s.media.alt} />
							{:else if s.media?.type === 'image'}
								<img src={s.media.src} alt={s.media.alt} loading="lazy" decoding="async" />
							{:else}
								<Cover variant={s.cover} seed={s.name} />
							{/if}
						</div>
					<div class="sw-body">
						<span class="eyebrow">{s.kind}</span>
						<h3>{s.name}</h3>
						<p>{s.summary}</p>
					</div>
				</a>
			{/each}
		</div>
		{/each}
		<p class="rows">{software.length} file(s)</p>
	</div>
</section>

<!-- ============================ CONTACT ============================ -->
<section class="section contact" id="contact">
	<div class="container">
		<div class="win guestbook">
			<div class="winbar"><span>GUESTBOOK.HTM — please sign my guestbook!</span><span class="winbtns"><i>_</i><i>□</i><i>×</i></span></div>
			<div class="win-body gb-body">
				<div class="gb-bot" aria-hidden="true"><Bot delay={300} /></div>
				<span class="section-num">$ mail {profile.email.split('@')[0]}</span>

				<h2 class="kinetic" use:reveal aria-label="Got an idea? Let's make something open.">
					{#each contactLines as line, li}
						<span class="k-line" class:outline-line={line.outline} aria-hidden="true">
							{#each line.text.split('') as ch, ci}
								<span class="k-ch" style="--i:{li * 6 + ci}">{ch === ' ' ? '\u00a0' : ch}</span>
							{/each}
						</span>
					{/each}
				</h2>

				<p class="contact-sub">collaborations, work, or just a question — the guestbook is an email ↓</p>

				<a class="btn btn-primary email" href="mailto:{profile.email}">
					<Icon name="mail" size={20} />
					<span use:scramble={profile.email}>{profile.email}</span>
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	/* ============ hero ============ */
	.hero {
		position: relative;
		padding: clamp(24px, 4vw, 48px) 0 clamp(40px, 6vw, 64px);
	}

	/* ============ outputs ============ */
	.pubs {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line-soft);
	}
	.pubs li {
		border-bottom: 1px solid var(--line-soft);
	}
	.pub,
	.pub:visited {
		display: grid;
		grid-template-columns: 56px minmax(0, 1fr);
		gap: 8px 20px;
		padding: 22px 0;
		color: var(--ink);
		text-decoration: none;
		transition: padding 0.3s var(--ease-out);
	}
	.pub:hover {
		color: var(--ink);
		padding-left: 10px;
	}
	.pub:hover .pub-arrow,
	.pub:hover .pub-year {
		color: var(--accent);
	}
	.pub-year {
		font-size: 0.78rem;
		color: var(--muted);
		padding-top: 4px;
		transition: color 0.15s;
	}
	.pub-body {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.pub-title {
		font-family: var(--font-display);
		font-size: clamp(1.45rem, 2.4vw, 1.9rem);
		line-height: 1;
	}
	.pub-venue {
		font-size: 0.76rem;
		color: var(--muted);
	}
	.pub-tags {
		grid-column: 2;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.pub-arrow {
		margin-left: auto;
		font-size: 1.1rem;
		line-height: 1;
		color: var(--muted);
		transition: color 0.15s;
	}
	@media (min-width: 860px) {
		.pub {
			grid-template-columns: 80px minmax(0, 1fr) auto;
			align-items: start;
		}
		.pub-tags {
			grid-column: 3;
			padding-top: 4px;
		}
	}
	.more {
		margin-top: 20px;
	}

	/* ============ software ============ */
	.sw-group {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin: 0 0 14px;
		font-size: 0.85rem;
	}
	.sw-group:not(:first-of-type) {
		margin-top: 40px;
	}
	.sw-group a {
		font-weight: 600;
		text-decoration: none;
	}
	.sw-group span {
		color: var(--muted);
	}
	.sw-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
		gap: 18px;
	}
	.sw,
	.sw:visited {
		display: flex;
		flex-direction: column;
		color: var(--ink);
		text-decoration: none;
	}
	.sw:hover {
		color: var(--ink);
	}
	.sw-cover {
		aspect-ratio: 5 / 3;
		overflow: hidden;
		border-bottom: 1px solid var(--line-soft);
		opacity: 0.7;
		transition: opacity 0.3s;
	}
	.sw:hover .sw-cover {
		opacity: 1;
	}
	.sw-cover video,
	.sw-cover img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(1) contrast(1.2);
	}
	:global(:root:not([data-theme='light'])) .sw-cover video,
	:global(:root:not([data-theme='light'])) .sw-cover img {
		filter: grayscale(1) contrast(1.3) sepia(1) hue-rotate(75deg) saturate(3) brightness(0.9);
	}
	.sw-body {
		flex: 1;
		padding: 16px 16px 18px;
	}
	.sw-body h3 {
		margin: 6px 0 8px;
		font-size: 1.9rem;
	}
	.sw-body p {
		margin: 0;
		font-size: 0.8rem;
	}

	/* ============ contact / guestbook ============ */
	.gb-body {
		position: relative;
		padding: clamp(24px, 5vw, 64px);
		overflow: hidden;
	}
	.gb-bot {
		position: absolute;
		right: clamp(12px, 4vw, 48px);
		top: clamp(12px, 4vw, 40px);
		width: clamp(70px, 10vw, 140px);
		height: clamp(70px, 10vw, 140px);
	}
	.kinetic {
		margin-top: 24px;
		font-size: clamp(3.2rem, 10vw, 8rem);
		line-height: 0.86;
	}
	.k-line {
		display: block;
		white-space: nowrap;
		clip-path: inset(-0.05em -0.2em 0 -0.2em);
	}
	.k-ch {
		display: inline-block;
		transform: translateY(105%);
	}
	.kinetic:global(.is-visible) .k-ch {
		animation: rise 0.7s var(--ease-out) forwards;
		animation-delay: calc(var(--i) * 30ms);
	}
	@keyframes rise {
		to {
			transform: none;
		}
	}
	.k-line.outline-line .k-ch {
		color: transparent;
		background: repeating-linear-gradient(to bottom, var(--ink) 0 2px, transparent 2px 4px);
		-webkit-background-clip: text;
		background-clip: text;
	}
	.k-ch:hover {
		color: var(--accent);
	}
	.contact-sub {
		margin-top: 32px;
		font-size: 0.9rem;
		color: var(--muted);
	}
	.email {
		margin-top: 8px;
		padding: 14px 20px;
		font-size: clamp(0.85rem, 2.4vw, 1.2rem);
		text-transform: none;
		overflow-wrap: anywhere;
	}
	@media (prefers-reduced-motion: reduce) {
		.k-ch {
			transform: none;
		}
	}
</style>
