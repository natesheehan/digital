/** Post slugs are file names without a dot, so /blog/rss.xml never matches the post route. */
export function match(param: string) {
	return /^[\w-]+$/.test(param);
}
