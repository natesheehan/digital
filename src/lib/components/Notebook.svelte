<script lang="ts">
	import { profile } from '$lib/data';

	/**
	 * ~/notebook/ opened in vim: a file tree on the left, the buffer with line numbers and
	 * markdown highlighting, and a status line. Click a file (or Tab) to switch buffers;
	 * click a line (or j/k) to move the cursor.
	 */
	type File = { name: string; lines: string[] };

	const files: File[] = [
		{
			name: 'id-card.md',
			lines: [
				`# ${profile.name}`,
				'',
				'he/him · philosophy & sociology of science',
				'',
				`- mail: [${profile.email}](mailto:${profile.email})`,
				`- orcid: [${profile.orcid}](${profile.links.orcid})`
			]
		},
		{
			name: 'path.md',
			lines: [
				'# Path',
				'',
				'1. BSc Computer Science — Manchester Metropolitan University',
				'2. MSc Smart Cities and Urban Analytics — University College London',
				'3. PhD Environmental Intelligence — University of Exeter'
			]
		},
		{
			name: 'questions.md',
			lines: [
				'# Questions',
				'',
				'- who is excluded when their data don’t fit an infrastructure’s formats?',
				'- what counts as data, and what makes them “open”?',
				'- when does open data cause epistemic harm, and to whom?',
				'- why do research infrastructures choose unrestricted, regulated or controlled access?',
				'- how do sequences travel from the lab to a public archive, and who does that work?'
			]
		},
		{
			name: 'methods.md',
			lines: [
				'# Methods',
				'',
				'- ethnographic observation',
				'- semi-structured interviews',
				'- comparative case studies',
				'- conceptual analysis',
				'- bibliometric and network analysis',
				'- geospatial analysis',
				'- social media sentiment analysis',
				'- quantitative modelling',
				'- participatory workshops and policy engagement',
				'- free and open source software development'
			]
		},
		{
			name: 'side-projects.md',
			lines: [
				'# Side projects',
				'',
				'- [x] [Concept Cartography](https://cc-nine-dusky.vercel.app/)',
				'- [x] [Epistemic Diversity reading group](https://epistemicdiversity.xyz/)',
				'- [x] [The Protocollege](https://proto.college/)',
				'- [x] [RDA: research data management ethics](https://www.rd-alliance.org/birds-of-a-feather/research-data-management-ethics/)',
				'- [x] [gigwork.city](https://gigwork.city/)'
			]
		}
	];

	/* ---------- a tiny markdown highlighter ---------- */
	type Tok = { t: string; c?: string; href?: string };

	function inline(s: string): Tok[] {
		const out: Tok[] = [];
		const re = /\[([^\]]+)\]\(([^)]+)\)/g;
		let at = 0;
		for (let m; (m = re.exec(s)); ) {
			if (m.index > at) out.push({ t: s.slice(at, m.index) });
			out.push({ t: m[1], c: 'link', href: m[2] });
			at = m.index + m[0].length;
		}
		if (at < s.length) out.push({ t: s.slice(at) });
		return out;
	}

	function highlight(s: string): Tok[] {
		if (s.startsWith('# ')) return [{ t: '# ', c: 'hd-mark' }, { t: s.slice(2), c: 'hd' }];
		const m = s.match(/^(- \[x\] |- |\d+\. )/);
		if (!m) return inline(s);
		const marker = m[1].startsWith('- [x]')
			? [{ t: '- ', c: 'li' }, { t: '[x]', c: 'chk' }, { t: ' ' }]
			: [{ t: m[1], c: 'li' }];
		return [...marker, ...inline(s.slice(m[1].length))];
	}

	/* what the line looks like with links concealed (conceallevel=2) — used for column counts */
	const shown = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

	const ROWS = 14;

	let open = 0;
	let cur = 0;
	let focused = false;
	let pending = '';

	$: file = files[open];
	$: buffer = file.lines.map(highlight);
	$: bytes = file.lines.reduce((n, l) => n + new TextEncoder().encode(l).length + 1, 0);
	$: message = `"notebook/${file.name}" ${file.lines.length}L, ${bytes}B`;

	function show(i: number) {
		open = (i + files.length) % files.length;
		cur = 0;
	}

	function move(d: number) {
		cur = Math.max(0, Math.min(file.lines.length - 1, cur + d));
	}

	function onKey(e: KeyboardEvent) {
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		const k = e.key;
		const handled = () => e.preventDefault();
		if (pending === 'g') {
			pending = '';
			if (k === 'g') return handled(), (cur = 0);
			if (k === 't') return handled(), show(open + 1);
			if (k === 'T') return handled(), show(open - 1);
		}
		if (k === 'j' || k === 'ArrowDown') return handled(), move(1);
		if (k === 'k' || k === 'ArrowUp') return handled(), move(-1);
		if (k === 'G') return handled(), (cur = file.lines.length - 1);
		if (k === 'g') return handled(), (pending = 'g');
		if (k === 'Tab') return handled(), show(open + (e.shiftKey ? -1 : 1));
		if (k === 'Enter') {
			const link = buffer[cur].find((t) => t.href);
			if (link) {
				handled();
				window.open(link.href, link.href!.startsWith('mailto:') ? '_self' : '_blank', 'noopener');
			}
		}
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex a11y-no-noninteractive-element-interactions -->
<div
	class="vim tty"
	role="application"
	aria-label="About me, as markdown files in a text editor. Tab switches file, j and k move."
	tabindex="0"
	on:keydown={onKey}
	on:focus={() => (focused = true)}
	on:blur={() => (focused = false)}
>
	<div class="tty-bar">
		<span>notebook/{file.name} — VIM</span>
		<span class="tty-ctl" aria-hidden="true"><i>–</i><i>□</i><i>×</i></span>
	</div>

	<!-- tabline (narrow screens) -->
	<nav class="tabline" aria-label="Open files">
		{#each files as f, i}
			<button class:sel={i === open} on:click={() => show(i)} tabindex="-1">{f.name}</button>
		{/each}
	</nav>

	<div class="panes">
		<nav class="tree" aria-label="Files">
			<p class="tree-root">~/notebook/</p>
			<ul>
				{#each files as f, i}
					<li>
						<button class:sel={i === open} on:click={() => show(i)}>
							<span class="dim">{i === files.length - 1 ? '└─' : '├─'}</span> {f.name}
						</button>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="buf">
			{#each buffer as toks, n}
				<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
				<p class="row" class:cur={n === cur} on:click={() => (cur = n)}>
					<span class="nr" aria-hidden="true">{n + 1}</span>
					<span class="txt">{#if !toks.length}{#if n === cur}<span class="blk" class:on={focused}> </span>{/if}{:else}{#each toks as tok, ti}{#if tok.href}<a
										class={tok.c}
										href={tok.href}
										target={tok.href.startsWith('mailto:') ? undefined : '_blank'}
										rel="noopener">{tok.t}</a
									>{:else if n === cur && ti === 0}<span class={tok.c ?? ''}><span class="blk" class:on={focused}>{tok.t[0]}</span>{tok.t.slice(1)}</span>{:else}<span class={tok.c ?? ''}>{tok.t}</span>{/if}{/each}{/if}</span>
				</p>
			{/each}
			{#each Array(Math.max(0, ROWS - buffer.length)) as _}
				<p class="row tilde" aria-hidden="true"><span class="nr" /><span class="txt">~</span></p>
			{/each}
		</div>
	</div>

	<div class="status" aria-hidden="true">
		<span class="mode">NORMAL</span>
		<span class="fname">notebook/{file.name} <span class="dim">[RO]</span></span>
		<span class="ft">markdown</span>
		<span class="ft">utf-8</span>
		<span class="pos">{cur + 1}:1</span>
		<span class="pct">All</span>
	</div>
	<p class="cmdline">{focused ? message : 'click a file · Tab / j k to move · ↵ opens a link'}</p>
</div>

<style>
	.vim {
		cursor: default;
	}
	.vim:focus {
		outline: none;
	}
	.vim:focus-visible {
		outline: 1px solid var(--t-dim);
		outline-offset: 2px;
	}
	.dim {
		color: var(--t-dim);
	}
	button {
		font: inherit;
		color: inherit;
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
		text-align: left;
	}

	/* ---------- tabline ---------- */
	.tabline {
		display: none;
		overflow-x: auto;
		background: var(--t-bg-hi);
		white-space: nowrap;
		scrollbar-width: none;
	}
	.tabline button {
		padding: 1px 1ch;
		color: var(--t-dim);
	}
	.tabline button.sel {
		background: var(--t-bg);
		color: var(--t-fg);
		font-weight: 700;
	}

	/* ---------- panes ---------- */
	.panes {
		display: grid;
		grid-template-columns: 22ch minmax(0, 1fr);
	}
	.tree {
		padding: 4px 1ch;
		border-right: 1px solid var(--t-line);
	}
	.tree-root {
		margin: 0;
		color: var(--t-blue);
		font-weight: 700;
	}
	.tree ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.tree button {
		width: 100%;
		white-space: pre;
	}
	.tree button:hover {
		color: var(--t-yellow);
	}
	.tree button.sel {
		background: var(--t-bg-hi);
		color: var(--t-yellow);
	}

	@media (max-width: 640px) {
		.tabline {
			display: block;
		}
		.panes {
			grid-template-columns: minmax(0, 1fr);
		}
		.tree {
			display: none;
		}
	}

	/* ---------- buffer ---------- */
	.buf {
		padding: 4px 0;
		cursor: text;
	}
	.row {
		display: grid;
		grid-template-columns: 4ch minmax(0, 1fr);
		gap: 1ch;
		margin: 0;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.row.cur {
		background: var(--t-bg-hi);
	}
	.nr {
		text-align: right;
		color: var(--t-dim);
		user-select: none;
	}
	.row.cur .nr {
		color: var(--t-yellow);
	}
	.tilde .txt {
		color: var(--t-blue);
	}
	.hd,
	.hd-mark {
		color: var(--t-yellow);
		font-weight: 700;
	}
	.li {
		color: var(--t-red);
	}
	.chk {
		color: var(--t-green);
	}
	.vim a.link,
	.vim a.link:visited {
		color: var(--t-cyan);
		text-decoration: underline;
		text-decoration-color: currentColor;
		text-underline-offset: 2px;
	}
	.vim a.link:hover {
		color: var(--t-bg);
		background: var(--t-cyan);
		text-decoration: none;
	}
	.blk {
		outline: 1px solid var(--t-fg);
		outline-offset: -1px;
	}
	.blk.on {
		outline: none;
		background: var(--t-fg);
		color: var(--t-bg);
	}

	/* ---------- status + command line ---------- */
	.status {
		display: flex;
		gap: 1ch;
		background: #2e3431;
		color: var(--t-fg);
		white-space: nowrap;
		overflow: hidden;
	}
	.mode {
		padding: 0 1ch;
		background: var(--t-green);
		color: var(--t-bg);
		font-weight: 700;
	}
	.fname {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.ft {
		color: var(--t-dim);
	}
	.pos,
	.pct {
		padding-right: 1ch;
	}
	@media (max-width: 640px) {
		.ft {
			display: none;
		}
	}
	.cmdline {
		margin: 0;
		padding: 0 1ch;
		min-height: 1.35em;
		color: var(--t-dim);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
