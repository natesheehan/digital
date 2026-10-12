import { marked } from 'marked';

/**
 * Blog posts live in src/posts/*.md. Each file starts with frontmatter:
 *
 *   ---
 *   title: My post
 *   date: 2026-10-12
 *   description: One line for the list page and RSS.
 *   tags: [open data, standards]
 *   draft: true            (optional — drafts show in `pnpm dev` only)
 *   ---
 *
 * The file name is the URL: src/posts/my-post.md → /blog/my-post.
 * Files starting with an underscore are ignored (see _template.md).
 * Lives in $lib/server so SvelteKit refuses to bundle posts into client JS.
 */

export type PostMeta = {
	slug: string;
	title: string;
	date: string;
	dateLabel: string;
	description: string;
	tags: string[];
	draft: boolean;
	minutes: number;
};

export type Post = PostMeta & { html: string };

const formatDate = (iso: string) =>
	new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

const files = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function parse(raw: string): { data: Record<string, string>; body: string } {
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!m) return { data: {}, body: raw };
	const data: Record<string, string> = {};
	for (const line of m[1].split(/\r?\n/)) {
		const kv = line.match(/^([\w-]+):\s*(.*)$/);
		if (kv) data[kv[1]] = kv[2].trim().replace(/^(['"])(.*)\1$/, '$2');
	}
	return { data, body: raw.slice(m[0].length) };
}

const list = (v = '') =>
	v
		.replace(/^\[|\]$/g, '')
		.split(',')
		.map((t) => t.trim().replace(/^(['"])(.*)\1$/, '$2'))
		.filter(Boolean);

const all: Post[] = Object.entries(files)
	.filter(([path]) => !path.split('/').pop()!.startsWith('_'))
	.map(([path, raw]) => {
		const slug = path.split('/').pop()!.replace(/\.md$/, '');
		const { data, body } = parse(raw);
		const words = body.split(/\s+/).filter(Boolean).length;
		return {
			slug,
			title: data.title || slug,
			date: data.date || '1970-01-01',
			dateLabel: formatDate(data.date || '1970-01-01'),
			description: data.description || '',
			tags: list(data.tags),
			draft: data.draft === 'true',
			minutes: Math.max(1, Math.round(words / 230)),
			html: marked.parse(body, { async: false }) as string
		};
	})
	.filter((p) => import.meta.env.DEV || !p.draft)
	.sort((a, b) => b.date.localeCompare(a.date));

export const posts: PostMeta[] = all.map(({ html, ...meta }) => meta);

export const getPost = (slug: string) => all.find((p) => p.slug === slug);
