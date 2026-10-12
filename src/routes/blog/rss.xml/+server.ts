import { posts, getPost } from '$lib/server/posts';
import { profile } from '$lib/data';

/* not prerendered, so links use whatever domain the site is served from */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function GET({ url }) {
	const site = url.origin;
	const items = posts
		.map((p) => {
			const link = `${site}/blog/${p.slug}`;
			return `<item><title>${esc(p.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${new Date(p.date + 'T00:00:00Z').toUTCString()}</pubDate><description>${esc(p.description)}</description><content:encoded><![CDATA[${getPost(p.slug)!.html.replace(/]]>/g, ']]]]><![CDATA[>')}]]></content:encoded></item>`;
		})
		.join('');
	const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>${esc(profile.name)} — blog</title><link>${site}/blog</link><description>${esc(profile.about)}</description>${items}</channel></rss>`;
	return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
