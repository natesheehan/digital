import { error } from '@sveltejs/kit';
import { posts, getPost } from '$lib/server/posts';

// 'auto' so the build doesn't fail while there are no posts yet
export const prerender = 'auto';

export function entries() {
	return posts.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	const post = getPost(params.slug);
	if (!post) throw error(404, 'No such post');
	const i = posts.findIndex((p) => p.slug === post.slug);
	return { post, newer: posts[i - 1] ?? null, older: posts[i + 1] ?? null };
}
