<script lang="ts">
	import '../app.postcss';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Field from '$lib/components/Field.svelte';
	import ClickBurst from '$lib/components/ClickBurst.svelte';
	import PageCurtain from '$lib/components/PageCurtain.svelte';

	export let data;
</script>

<a class="skip" href="#main">Skip to content</a>

<Field />

<Header />

{#key data.url}
	<main id="main" in:fade={{ duration: 300, easing: cubicOut }}>
		<div class="page"><slot /></div>
	</main>
{/key}

<Footer />

<ClickBurst />
<PageCurtain />

<style>
	main {
		position: relative;
		min-height: 70vh;
	}
	.page {
		position: relative;
		z-index: 1;
	}
	.skip {
		position: absolute;
		left: 16px;
		top: -60px;
		z-index: 60;
		padding: 8px 14px;
		background: var(--ink);
		color: var(--bg);
	}
	.skip:focus {
		top: 12px;
	}
</style>
