import { posts } from '$lib/server/posts';

export const prerender = true;

export function load() {
	return { posts };
}
