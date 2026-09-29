import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Pin the runtime explicitly: the adapter can't infer one from Vercel's Node 22 build image.
		adapter: adapter({ runtime: 'nodejs22.x' })
	}
};

export default config;
