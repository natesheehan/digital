<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { profile, publications, software } from '$lib/data';

	type Entry = {
		name: string;
		perms: string;
		size: string;
		href: string;
		external?: boolean;
		note?: string;
	};

	const entries: Entry[] = [
		{ name: 'outputs/', perms: 'drwxr-xr-x', size: String(publications.length), href: '/writing', note: 'articles, thesis, reports & data' },
		{ name: 'software/', perms: 'drwxr-xr-x', size: String(software.length), href: '/projects', note: 'free & open source' },
		{ name: 'blog/', perms: 'drwxr-xr-x', size: '1', href: '/blog', note: 'posts' },
		{ name: 'cv.pdf', perms: '-rw-r--r--', size: '1', href: '/cv' },
		{ name: 'notebook.md', perms: '-rw-r--r--', size: '1', href: '#notebook' },
		{ name: 'contact.sh', perms: '-rwxr-xr-x', size: '1', href: '#contact' },
		{ name: 'github', perms: 'lrwxrwxrwx', size: '1', href: profile.links.github, external: true },
		{ name: 'orcid', perms: 'lrwxrwxrwx', size: '1', href: profile.links.orcid, external: true }
	];

	/* 36×22 render of /me.png (frame 2), dark pixels → dense glyphs */
	const portrait = `                     ::
            .-=*****%@@@#+-.
         .=+#@@@@@@@@@@@@@%*+-.
       :*%@@@@@@@@@@@@@@@@@@@%=::
       *@@@@@@@@@@@%###%@@@@@@@#+:
      +%@@@@*+++=-:::.:-=*#@@@@@%+:
    :#@@@@@+----:.....::-=+*@@@@@%=.
   -*@@@@@#==--:.....::-++**#@@@@@#:
   -#@@@@%+*****=-:::-+##*##%%@@@@@=
    *@@@@#****####+--+#*####*#@@@@+:
    -%@@@*==****=++--+==**++=+%@@@+:
    =%@@#*=------=+--+=-----=*%@@@*-
  .:--#@%*+=-----++--**=--==+#%@@#+=
  :::--*@%#===---+#**#*--==++%@@%#+=
 .::--=+#@@+==--==+========+*@@%#**+
 .::--=+*###++==+*******+=+*%@@%##*+
 .:--==+**#%#**+=+++++++++#%@@%%##**
 .---=++*##%%#***++==+++*###%@@@%##*
 .--==+**#%%@#***#***#*###**%%%@@@@%
 :===+*#%%%#%#*+*########***#%@@@@@@
 :++#%@@@%*###*+++***#**++*#@@@@@@@@
 -@@@@@@@@%####*+=++++***#@@@@@@@@@@`;

	const user = 'nsheehan';
	const host = 'digital';
	const nameWidth = Math.max(...entries.map((e) => e.name.length));
	const sizeWidth = Math.max(...entries.map((e) => e.size.length));

	/* ---------- interactive prompt ---------- */
	type Out = { text: string; href?: string; external?: boolean };
	type Run = { cmd: string; out: Out[]; ls?: boolean };

	let lastLogin = '';
	let history: Run[] = [];
	let recall: string[] = [];
	let recallAt = 0;
	let value = '';
	let caret = 0;
	let focused = false;
	let input: HTMLInputElement;

	const lookup = (arg: string) => {
		const a = arg.replace(/^(~\/|\.\/)/, '').replace(/\/$/, '').toLowerCase();
		return entries.find((e) => e.name.replace(/\/$/, '').replace(/\.(pdf|md|sh)$/, '') === a.replace(/\.(pdf|md|sh)$/, ''));
	};

	function follow(e: Entry) {
		if (e.external) window.open(e.href, '_blank', 'noopener');
		else if (e.href.startsWith('#')) document.querySelector(e.href)?.scrollIntoView({ behavior: 'smooth' });
		else goto(e.href);
	}

	function exec(line: string): Run {
		const cmd = line.trim();
		const [bin = '', ...args] = cmd.split(/\s+/);
		const arg = args.filter((a) => !a.startsWith('-')).join(' ');
		const run: Run = { cmd: line, out: [] };
		const say = (text: string, href?: string, external?: boolean) => run.out.push({ text, href, external });

		if (!bin) return run;

		if (bin.startsWith('./') && lookup(bin)) {
			follow(lookup(bin)!);
			return run;
		}

		switch (bin) {
			case 'help':
				say('GNU bash, version 5.2 — commands on this machine:');
				say('  ls              list home');
				say('  cd <dir>        open a directory (outputs, software, blog)');
				say('  open <file>     open a file or link (cv.pdf, github, orcid …)');
				say('  ./contact.sh    say hello');
				say('  whoami · pwd · date · echo · clear');
				break;
			case 'ls':
			case 'll':
			case 'dir':
				run.ls = true;
				break;
			case 'cd':
			case 'open':
			case 'cat':
			case 'less':
			case 'xdg-open': {
				if (!arg || arg === '~' || arg === '.') break;
				const hit = lookup(arg);
				if (hit) follow(hit);
				else say(`bash: ${bin}: ${arg}: No such file or directory`);
				break;
			}
			case 'whoami':
				say(profile.name);
				break;
			case 'pwd':
				say(`/home/${user}`);
				break;
			case 'date':
				say(new Date().toString());
				break;
			case 'echo':
				say(args.join(' '));
				break;
			case 'mail':
				say(profile.email, `mailto:${profile.email}`);
				break;
			case 'sudo':
				say(`${user} is not in the sudoers file.  This incident will be reported.`);
				break;
			case 'exit':
			case 'logout':
				say('logout');
				say('(nice try — this one stays open)');
				break;
			default:
				say(`bash: ${bin}: command not found`);
		}
		return run;
	}

	async function submit() {
		const line = value;
		value = '';
		caret = 0;
		if (line.trim()) recall = [...recall, line];
		recallAt = recall.length;
		if (line.trim() === 'clear') history = [];
		else history = [...history, exec(line)].slice(-24);
		await tick();
		input?.scrollIntoView({ block: 'nearest' });
	}

	function complete() {
		const parts = value.split(' ');
		const last = parts[parts.length - 1];
		if (parts.length < 2 && !last.startsWith('./')) return;
		const stem = last.replace(/^\.\//, '');
		const hits = entries.filter((e) => e.name.startsWith(stem));
		if (hits.length === 1) {
			parts[parts.length - 1] = (last.startsWith('./') ? './' : '') + hits[0].name;
			value = parts.join(' ');
			caret = value.length;
		}
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			submit();
		} else if (e.key === 'Tab' && value) {
			e.preventDefault();
			complete();
		} else if (e.key === 'ArrowUp' && recall.length) {
			e.preventDefault();
			recallAt = Math.max(0, recallAt - 1);
			value = recall[recallAt];
			caret = value.length;
		} else if (e.key === 'ArrowDown' && recall.length) {
			e.preventDefault();
			recallAt = Math.min(recall.length, recallAt + 1);
			value = recall[recallAt] ?? '';
			caret = value.length;
		} else if (e.key === 'l' && e.ctrlKey) {
			e.preventDefault();
			history = [];
		} else if (e.key === 'c' && e.ctrlKey && !window.getSelection()?.toString()) {
			e.preventDefault();
			history = [...history, { cmd: value + '^C', out: [] }];
			value = '';
			caret = 0;
		}
	}

	const sync = () => requestAnimationFrame(() => (caret = input?.selectionStart ?? value.length));

	function focusPrompt(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('a')) return;
		if (window.getSelection()?.toString()) return;
		input?.focus({ preventScroll: true });
	}

	onMount(() => {
		const d = new Date(Date.now() - 1000 * 60 * 60 * 26);
		const pad = (n: number) => String(n).padStart(2, '0');
		const day = d.toLocaleDateString('en-GB', { weekday: 'short' });
		const mon = d.toLocaleDateString('en-GB', { month: 'short' });
		lastLogin = `Last login: ${day} ${mon} ${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${d.getFullYear()} on pts/0`;
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="term tty" on:click={focusPrompt}>
	<div class="tty-bar">
		<span class="title">{user}@{host}: ~</span>
		<span class="tty-ctl" aria-hidden="true"><i>–</i><i>□</i><i>×</i></span>
	</div>

	<div class="screen">
		<p class="ln dim">{lastLogin || ' '}</p>

		<p class="ln"><span class="ps1">{user}@{host}</span>:<span class="cwd">~</span>$ neofetch</p>
		<div class="fetch">
			<pre class="portrait" role="img" aria-label="ASCII portrait of {profile.name}">{portrait}</pre>
			<div class="info">
				<p class="ln"><span class="ps1">{user}</span>@<span class="ps1">{host}</span></p>
				<p class="ln rule" aria-hidden="true">{'-'.repeat(user.length + host.length + 1)}</p>
				<h1 class="ln"><span class="k">Name</span>: {profile.name}</h1>
				<p class="ln"><span class="k">Research</span>: philosophy of (open) data</p>
				<p class="ln">{' '.repeat(10)}sociology of scientific standards</p>
				<p class="ln"><span class="k">Code</span>: free &amp; open source software</p>
				<p class="ln"><span class="k">Outputs</span>: {publications.length} (articles, thesis, reports, data)</p>
				<p class="ln"><span class="k">Packages</span>: {software.length} (R, dashboards)</p>
				<p class="ln"><span class="k">ORCID</span>: <a href={profile.links.orcid}>{profile.orcid}</a></p>
				<p class="ln"><span class="k">Mail</span>: <a href="mailto:{profile.email}">{profile.email}</a></p>
				<p class="ln"><span class="k">Shell</span>: bash 5.2</p>
				<p class="ln swatch" aria-hidden="true"><i /><i /><i /><i /><i /><i /></p>
			</div>
		</div>

		<p class="ln"><span class="ps1">{user}@{host}</span>:<span class="cwd">~</span>$ ls -l</p>
		<p class="ln">total {entries.length}</p>
		<ul class="ls">
			{#each entries as e}
				<li class="ln">
					<span class="meta">{e.perms} 1 {user} {user} {e.size.padStart(sizeWidth)}{' '}</span><a
						href={e.href}
						class:dir={e.name.endsWith('/')}
						class:exe={e.name.endsWith('.sh')}
						class:lnk={e.external}>{e.name}</a
					>{#if e.external}<span class="dim">{' -> '}{e.href.replace('https://', '')}</span>{:else if e.note}<span class="dim">{' '.repeat(nameWidth - e.name.length + 2)}# {e.note}</span>{/if}
				</li>
			{/each}
		</ul>

		{#each history as h}
			<p class="ln"><span class="ps1">{user}@{host}</span>:<span class="cwd">~</span>$ {h.cmd}</p>
			{#if h.ls}
				<p class="ln">
					{#each entries as e}<a href={e.href} class:dir={e.name.endsWith('/')} class:exe={e.name.endsWith('.sh')} class:lnk={e.external}>{e.name}</a>{'  '}{/each}
				</p>
			{/if}
			{#each h.out as o}
				<p class="ln">{#if o.href}<a href={o.href}>{o.text}</a>{:else}{o.text}{/if}</p>
			{/each}
		{/each}

		<label class="ln prompt">
			<span class="ps1">{user}@{host}</span>:<span class="cwd">~</span>$&nbsp;<span class="typed" aria-hidden="true">{value.slice(0, caret)}<span class="block" class:on={focused}>{value[caret] ?? ' '}</span>{value.slice(caret + 1)}</span>
			<input
				bind:this={input}
				bind:value
				on:keydown={onKey}
				on:input={sync}
				on:keyup={sync}
				on:click={sync}
				on:focus={() => ((focused = true), sync())}
				on:blur={() => (focused = false)}
				type="text"
				autocomplete="off"
				autocapitalize="off"
				spellcheck="false"
				aria-label="Terminal prompt — type help"
			/>
		</label>
		{#if !focused && !history.length}
			<p class="ln dim hint">click and type <b>help</b></p>
		{/if}
	</div>
</div>

<style>
	.term {
		cursor: text;
	}

	.screen {
		padding: 8px 10px 12px;
		overflow-wrap: anywhere;
	}
	.ln {
		margin: 0;
		font: inherit;
		white-space: pre-wrap;
	}
	h1.ln {
		font-family: inherit;
		font-size: inherit;
		line-height: inherit;
		letter-spacing: normal;
	}
	.dim {
		color: var(--t-dim);
	}
	.ps1 {
		color: var(--t-green);
		font-weight: 700;
	}
	.cwd {
		color: var(--t-blue);
		font-weight: 700;
	}

	.term a,
	.term a:visited {
		color: inherit;
		text-decoration: none;
	}
	.term a:hover,
	.term a:focus-visible {
		text-decoration: underline;
		text-underline-offset: 2px;
		background: none;
	}
	.term a.dir,
	.term a.dir:visited {
		color: var(--t-blue);
		font-weight: 700;
	}
	.term a.exe,
	.term a.exe:visited {
		color: var(--t-green);
		font-weight: 700;
	}
	.term a.lnk,
	.term a.lnk:visited {
		color: var(--t-cyan);
		font-weight: 700;
	}

	/* ---------- neofetch ---------- */
	.fetch {
		display: flex;
		gap: 3ch;
		margin: 2px 0 1.35em;
	}
	.portrait {
		margin: 0;
		font: inherit;
		color: var(--t-green);
	}
	.info .k {
		color: var(--t-green);
		font-weight: 700;
		white-space: pre;
	}
	.swatch {
		display: flex;
		margin-top: 1.35em;
	}
	.swatch i {
		width: 3ch;
		height: 1.35em;
	}
	.swatch i:nth-child(1) { background: var(--t-red); }
	.swatch i:nth-child(2) { background: var(--t-green); }
	.swatch i:nth-child(3) { background: var(--t-yellow); }
	.swatch i:nth-child(4) { background: var(--t-blue); }
	.swatch i:nth-child(5) { background: var(--t-magenta); }
	.swatch i:nth-child(6) { background: var(--t-cyan); }

	@media (max-width: 640px) {
		.fetch {
			flex-direction: column;
			gap: 1.35em;
		}
		.portrait {
			font-size: 9px;
			line-height: 1.15;
		}
	}

	/* ---------- ls ---------- */
	.ls {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	@media (max-width: 640px) {
		.ls .meta {
			display: none;
		}
	}

	/* ---------- prompt ---------- */
	.prompt {
		display: block;
		position: relative;
	}
	.prompt input {
		position: absolute;
		inset: 0;
		width: 100%;
		opacity: 0;
		border: 0;
		padding: 0;
		font: inherit;
		/* 16px stops iOS zooming on focus */
		font-size: 16px;
		cursor: text;
	}
	.block {
		outline: 1px solid var(--t-fg);
		outline-offset: -1px;
	}
	.block.on {
		background: var(--t-fg);
		color: var(--t-bg);
		outline: none;
		animation: blink 1.06s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			background: transparent;
			color: inherit;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.block.on {
			animation: none;
		}
	}
	.hint b {
		color: var(--t-fg);
		font-weight: 400;
	}
</style>
