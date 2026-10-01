<script lang="ts">
	import { onMount } from 'svelte';
	import { profile } from '$lib/data';

	/**
	 * NATE-PC: a little retro workstation that boots when scrolled into view and types out the
	 * "get to know me" records on its CRT. Keys light up as they're "pressed"; the drive LED
	 * flickers while output prints. Pick a file on the right to jump straight to a record.
	 */
	type Out = string | { text: string; href: string };
	type Rec = { file: string; cmd: string; out: Out[] };

	const recs: Rec[] = [
		{
			file: 'ID-CARD.TXT',
			cmd: 'whoami',
			out: ['NAME .... Nathanael Sheehan (he/him)', 'FIELD ... philosophy & sociology of science', `MAIL .... ${profile.email}`, `ORCID ... ${profile.orcid}`]
		},
		{
			file: 'PATH.LOG',
			cmd: 'cat path.log',
			out: ['1. BSc computer science', '2. MSc geography', '3. PhD environmental intelligence', '4. philosophy & sociology of science']
		},
		{
			file: 'QUESTIONS.MD',
			cmd: 'cat questions.md',
			out: ['? what counts as data?', '? who sets the standards?', '? openness vs. accountability', '? whose knowledge gets left out?']
		},
		{
			file: 'TOOLBOX.SH',
			cmd: './toolbox.sh --list',
			out: ['> ethnographic observation', '> semi-structured interviews', '> quantitative modelling', '> free and open source software development']
		},
		{
			file: 'PROJECTS.LOG',
			cmd: 'tail projects.log',
			out: [
				{ text: '[x] Concept Cartography ↗', href: 'https://cc-nine-dusky.vercel.app/' },
				{ text: '[x] Epistemic Diversity reading group ↗', href: 'https://epistemicdiversity.xyz/' },
				{ text: '[x] The Protocollege ↗', href: 'https://proto.college/' },
				{ text: '[x] RDA: research data management ethics ↗', href: 'https://www.rd-alliance.org/birds-of-a-feather/research-data-management-ethics/' },
				{ text: '[x] gigwork.city ↗', href: 'https://gigwork.city/' }
			]
		}
	];

	const outText = (o: Out) => (typeof o === 'string' ? o : o.text);
	const outHref = (o: Out) => (typeof o === 'string' ? undefined : o.href);

	const boot = ['NATE-BIOS v2.6  (c) SHEEHAN SOFT', 'MEMORY TEST ... 640K OK', 'LOADING OPEN-DATA.SYS ... OK', ''];
	const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
	const MAX_LINES = 14;

	type Line = { text: string; kind: 'cmd' | 'out' | 'sys'; href?: string };
	let lines: Line[] = [];
	let typing = '';
	let pressed = '';
	let busy = false;
	let on = false;
	let current = -1;
	let read = new Set<number>();
	let root: HTMLElement;
	let run = 0; // bumped to cancel an in-flight sequence
	let reduce = false;

	const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
	const push = (l: Line) => (lines = [...lines, l].slice(-MAX_LINES));

	function keyFor(ch: string) {
		if (ch === ' ') return 'SPACE';
		const up = ch.toUpperCase();
		if (rows.some((r) => r.includes(up))) return up;
		const all = rows.join('');
		return all[Math.floor(Math.random() * all.length)];
	}

	async function play(i: number, token: number) {
		current = i;
		const r = recs[i];
		if (reduce) {
			push({ text: r.cmd, kind: 'cmd' });
			r.out.forEach((o) => push({ text: outText(o), href: outHref(o), kind: 'out' }));
			read = new Set(read).add(i);
			return;
		}
		for (const ch of r.cmd) {
			if (token !== run) return;
			typing += ch;
			pressed = keyFor(ch);
			await wait(55 + Math.random() * 70);
		}
		pressed = 'ENTER';
		await wait(160);
		pressed = '';
		push({ text: typing, kind: 'cmd' });
		typing = '';
		busy = true;
		for (const o of r.out) {
			await wait(110);
			if (token !== run) return;
			push({ text: outText(o), href: outHref(o), kind: 'out' });
		}
		busy = false;
		read = new Set(read).add(i);
	}

	async function autoplay() {
		const token = ++run;
		on = true;
		busy = true;
		for (const text of boot) {
			await wait(reduce ? 0 : 260);
			if (token !== run) return;
			push({ text, kind: 'sys' });
		}
		busy = false;
		for (let i = 0; i < recs.length; i++) {
			if (token !== run) return;
			await play(i, token);
			if (!reduce) await wait(1500);
		}
		if (token === run) finish();
	}

	function finish() {
		push({ text: '', kind: 'sys' });
		push({ text: `${recs.length}/${recs.length} records read. contact: ${profile.email}`, kind: 'sys' });
		current = -1;
	}

	async function pick(i: number) {
		const token = ++run;
		on = true;
		typing = '';
		pressed = '';
		busy = false;
		push({ text: '', kind: 'sys' });
		await play(i, token);
		if (token === run && read.size === recs.length) finish();
	}

	onMount(() => {
		reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					io.disconnect();
					if (!on) autoplay();
				}
			},
			{ threshold: 0.35 }
		);
		io.observe(root);
		return () => {
			io.disconnect();
			run++;
		};
	});
</script>

<div class="ws win" bind:this={root}>
	<div class="winbar"><span>NATE-PC — C:\ABOUT</span><span class="winbtns"><i>_</i><i>□</i><i>×</i></span></div>

	<div class="ws-body win-body">
		<div class="rig" aria-hidden="true">
			<div class="monitor">
				<div class="bezel">
					<div class="screen" class:on>
						<div class="glass">
							{#each lines as l}
								<p class={l.kind}>{#if l.kind === 'cmd'}<span class="prompt">C:\&gt;</span> {/if}{#if l.href}<a href={l.href} target="_blank" rel="noopener" tabindex="-1">{l.text}</a>{:else}{l.text || '\u00a0'}{/if}</p>
							{/each}
							{#if on}<p class="cmd"><span class="prompt">C:\&gt;</span> {typing}<span class="cursor">█</span></p>{/if}
						</div>
					</div>
					<div class="chin">
						<span class="brand">NATE-PC 486</span>
						<span class="knobs"><b /><b /></span>
						<span class="led" class:lit={on} />
					</div>
				</div>
				<div class="neck" />
				<div class="foot" />
			</div>

			<div class="tower">
				<div class="bay"><span class="slot" /></div>
				<div class="bay"><span class="slot wide" /></div>
				<div class="lights">
					<span class="led" class:lit={on} />
					<span class="led hdd" class:busy={busy || !!typing} />
				</div>
				<div class="vents">{#each Array(6) as _}<i />{/each}</div>
				<span class="turbo">TURBO</span>
			</div>

			<div class="keyboard">
				{#each rows as row, ri}
					<div class="krow" style="--indent:{ri * 0.5}">
						{#each row.split('') as k}<span class="key" class:down={pressed === k}>{k}</span>{/each}
						{#if ri === 1}<span class="key enter" class:down={pressed === 'ENTER'}>↵</span>{/if}
					</div>
				{/each}
				<div class="krow"><span class="key space" class:down={pressed === 'SPACE'} /></div>
			</div>
		</div>

		<nav class="files" aria-label="About me records">
			<p class="dir">C:\ABOUT&gt; dir</p>
			<ul>
				{#each recs as r, i}
					<li>
						<button class:active={current === i} class:read={read.has(i)} on:click={() => pick(i)}>
							<span class="fname">{r.file}</span>
							<span class="tick" aria-hidden="true">{read.has(i) ? '✓' : ''}</span>
						</button>
					</li>
				{/each}
			</ul>
			<p class="count">{read.size}/{recs.length} read</p>
		</nav>
	</div>
</div>

<details class="plain">
	<summary>view as plain text (ABOUT.TXT)</summary>
	{#each recs as r}
		<pre>== {r.file} =={'\n'}{#each r.out as o}{#if outHref(o)}<a href={outHref(o)}>{outText(o)}</a>{:else}{outText(o)}{/if}{'\n'}{/each}</pre>
	{/each}
</details>

<style>
	.ws-body {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 24px;
		padding: clamp(16px, 3vw, 32px);
	}
	@media (min-width: 860px) {
		.ws-body {
			grid-template-columns: minmax(0, 1fr) 220px;
			align-items: center;
		}
	}

	/* ---------- the computer ---------- */
	.rig {
		--case: var(--face);
		--scr-bg: #020904;
		--scr-ink: #b8f2c8;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		grid-template-areas: 'mon tower' 'kbd tower';
		gap: 18px 22px;
		align-items: end;
		max-width: 720px;
		margin: 0 auto;
		width: 100%;
	}
	.monitor {
		grid-area: mon;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.bezel {
		width: 100%;
		padding: 18px 18px 10px;
		background: var(--case);
		border-radius: 10px 10px 6px 6px;
		box-shadow: inset -2px -2px var(--b-dark), inset 2px 2px var(--b-light), inset -4px -4px var(--b-shade),
			inset 4px 4px var(--b-soft), var(--shadow);
	}
	.screen {
		position: relative;
		aspect-ratio: 4 / 3;
		max-height: 360px;
		width: 100%;
		overflow: hidden;
		border-radius: 14px / 18px;
		background: #000;
		box-shadow: inset 0 0 0 3px var(--b-shade), inset 0 0 30px rgb(0 0 0 / 0.9);
	}
	.glass {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 14px 16px;
		background: radial-gradient(ellipse at center, #06170c 0%, var(--scr-bg) 75%);
		color: var(--scr-ink);
		font-family: var(--font-display);
		font-size: clamp(0.95rem, 2.1vw, 1.25rem);
		line-height: 1.12;
		text-shadow: 0 0 4px rgb(184 242 200 / 0.6), 0 0 12px rgb(184 242 200 / 0.25);
		transform: scale(1, 0.004);
		filter: brightness(3);
		opacity: 0;
	}
	.screen.on .glass {
		animation: power-on 0.7s var(--ease-out) forwards;
	}
	/* scanlines + slow rolling bar */
	.screen::before,
	.screen::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 1;
	}
	.screen::before {
		background: repeating-linear-gradient(to bottom, rgb(0 0 0 / 0.28) 0 1px, transparent 1px 3px);
	}
	.screen.on::after {
		background: linear-gradient(to bottom, transparent, rgb(184 242 200 / 0.07), transparent);
		height: 30%;
		animation: roll 6s linear infinite;
	}
	.glass p {
		margin: 0;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.glass .sys {
		opacity: 0.7;
	}
	.glass .out {
		padding-left: 1ch;
	}
	.glass a {
		position: relative;
		z-index: 2;
		color: inherit;
		text-decoration-color: currentColor;
	}
	.glass a:hover {
		color: var(--scr-bg);
		background: var(--scr-ink);
		text-decoration: none;
	}
	.prompt {
		opacity: 0.75;
	}
	.cursor {
		animation: blink 1s steps(1) infinite;
	}

	.chin {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 8px;
		font-family: var(--font-pixel);
		font-size: 0.6rem;
		color: var(--muted);
		text-shadow: none;
	}
	.brand {
		flex: 1;
	}
	.knobs {
		display: flex;
		gap: 6px;
	}
	.knobs b {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--b-shade);
		box-shadow: inset 1px 1px var(--b-soft);
	}
	.neck {
		width: 26%;
		height: 14px;
		background: var(--case);
		box-shadow: inset -2px 0 var(--b-shade), inset 2px 0 var(--b-soft);
	}
	.foot {
		width: 46%;
		height: 10px;
		border-radius: 4px 4px 0 0;
		background: var(--case);
		box-shadow: inset -1px -1px var(--b-dark), inset 1px 1px var(--b-light), inset -2px -2px var(--b-shade);
	}

	.led {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #1a3322;
		box-shadow: inset 1px 1px rgb(0 0 0 / 0.5);
		transition: background 0.2s;
	}
	.led.lit {
		background: #b8f2c8;
		box-shadow: 0 0 6px #b8f2c8;
	}
	.led.hdd {
		background: #3a2a00;
	}
	.led.hdd.busy {
		animation: hdd 0.18s steps(2) infinite;
	}

	/* ---------- tower ---------- */
	.tower {
		grid-area: tower;
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 92px;
		height: 100%;
		min-height: 260px;
		padding: 14px 10px;
		background: var(--case);
		border-radius: 4px;
		box-shadow: inset -2px -2px var(--b-dark), inset 2px 2px var(--b-light), inset -4px -4px var(--b-shade),
			inset 4px 4px var(--b-soft), var(--shadow);
	}
	.bay {
		height: 22px;
		display: grid;
		place-items: center;
		box-shadow: inset 1px 1px var(--b-shade), inset -1px -1px var(--b-light);
	}
	.slot {
		width: 60%;
		height: 3px;
		background: var(--b-dark);
	}
	.slot.wide {
		width: 80%;
	}
	.lights {
		display: flex;
		gap: 8px;
		justify-content: flex-end;
		padding: 4px 2px;
	}
	.vents {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
	}
	.vents i {
		height: 3px;
		background: var(--b-shade);
		box-shadow: 0 1px var(--b-light);
	}
	.turbo {
		align-self: flex-start;
		padding: 2px 4px;
		font-family: var(--font-pixel);
		font-size: 0.55rem;
		color: var(--accent);
		text-shadow: none;
		box-shadow: inset 1px 1px var(--b-shade), inset -1px -1px var(--b-light);
	}

	/* ---------- keyboard ---------- */
	.keyboard {
		grid-area: kbd;
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 10px 12px 12px;
		background: var(--case);
		border-radius: 4px 4px 8px 8px;
		transform: perspective(600px) rotateX(18deg);
		transform-origin: top;
		box-shadow: inset -2px -2px var(--b-dark), inset 2px 2px var(--b-light), inset -3px -3px var(--b-shade),
			inset 3px 3px var(--b-soft), var(--shadow);
	}
	.krow {
		display: flex;
		gap: 4px;
		padding-left: calc(var(--indent, 0) * 18px);
	}
	.key {
		flex: 1;
		min-width: 0;
		height: clamp(16px, 3vw, 24px);
		display: grid;
		place-items: center;
		font-family: var(--font-mono);
		font-size: clamp(0.45rem, 1.2vw, 0.62rem);
		color: var(--ink);
		text-shadow: none;
		background: var(--face);
		box-shadow: inset -1px -1px var(--b-dark), inset 1px 1px var(--b-light), inset -2px -2px var(--b-shade),
			0 2px 0 var(--b-dark);
		transition: transform 60ms, background 60ms;
	}
	:global(:root[data-theme='light']) .key {
		color: #000;
	}
	.key.enter {
		flex: 1.6;
	}
	.key.space {
		flex: none;
		width: 55%;
		margin: 0 auto;
	}
	.key.down {
		transform: translateY(2px);
		background: var(--ink);
		color: var(--bg);
		box-shadow: inset 1px 1px var(--b-dark), 0 0 10px var(--ink);
	}
	:global(:root[data-theme='light']) .key.down {
		background: var(--accent);
		color: #fff;
	}

	@media (max-width: 560px) {
		.rig {
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas: 'mon' 'kbd';
		}
		.tower {
			display: none;
		}
		.bezel {
			padding: 12px 12px 8px;
		}
	}

	/* ---------- file list ---------- */
	.files {
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}
	.dir {
		margin: 0 0 8px;
		opacity: 0.8;
	}
	.files ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 6px;
	}
	.files button {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 8px 10px;
		border: 0;
		cursor: pointer;
		font: inherit;
		color: var(--ink);
		text-align: left;
		background: var(--face);
		box-shadow: inset -1px -1px var(--b-dark), inset 1px 1px var(--b-light), inset -2px -2px var(--b-shade),
			inset 2px 2px var(--b-soft);
	}
	:global(:root[data-theme='light']) .files button {
		color: #000;
	}
	.files button:hover,
	.files button:focus-visible,
	.files button.active {
		background: var(--ink);
		color: var(--bg);
		text-shadow: none;
	}
	.files button.active .fname::before {
		content: '> ';
	}
	.files button.read:not(.active) {
		opacity: 0.75;
	}
	.count {
		margin: 10px 0 0;
		opacity: 0.7;
		font-size: 0.72rem;
	}

	.plain {
		margin-top: 14px;
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}
	.plain summary {
		cursor: pointer;
	}
	.plain pre {
		white-space: pre-wrap;
	}

	@keyframes power-on {
		0% {
			opacity: 1;
			transform: scale(1, 0.004);
			filter: brightness(3);
		}
		45% {
			transform: scale(1, 0.004);
		}
		100% {
			opacity: 1;
			transform: none;
			filter: none;
		}
	}
	@keyframes roll {
		from {
			transform: translateY(-100%);
		}
		to {
			transform: translateY(400%);
		}
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	@keyframes hdd {
		0% {
			background: #ffb547;
			box-shadow: 0 0 6px #ffb547;
		}
		100% {
			background: #3a2a00;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.screen.on .glass {
			animation: none;
			opacity: 1;
			transform: none;
			filter: none;
		}
		.screen.on::after,
		.cursor,
		.led.hdd.busy {
			animation: none;
		}
	}
</style>
