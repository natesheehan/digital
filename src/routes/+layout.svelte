<script lang='ts'>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-vintage.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import {AppShell,Avatar, AppBar, Drawer, drawerStore} from '@skeletonlabs/skeleton'
	import Navigation from '$lib/components/Navigation.svelte';
	import { fly, slide } from 'svelte/transition'

	export let data;

function drawerOpen(): void{
	drawerStore.open();
}
</script>

<Drawer>
	<Navigation/>
</Drawer>



<AppShell slotSidebarLeft="w-0 md:w-52 bg-surface-500/10">
	<svelte:fragment slot="header">
		
<AppBar>
	<svelte:fragment slot="lead">
		<button w-120 class="md:hidden btn btn-sm mr-4" on:click={drawerOpen}>
			<span>
				<svg viewBox="0 0 100 88" class="fill-token w-4 h-4">
					<rect width="100" height ="20"/>
					<rect y="30" width="100" height="20"/>
					<rect y="60" width="100" height="20"/>
				</svg>
			</span>
		</button>
		<strong w-120 class="text-xl uppercase"> Nathanael Sheehan </strong>
	</svelte:fragment>

	<svelte:fragment slot="trail">
		<div class="logo-cloud grid-cols-1 lg:!grid-cols-3 gap-1">
			<a class="logo-item" href="https://github.com/natesheehan">
				<span>(git)</span>
			</a>

			<a class="logo-item" href="https://twitter.com/thanaelsheehan?lang=en-GB">
				<span>(twatta)</span>
			</a>
			<a class="logo-item" href="https://orcid.org/0000-0002-2779-0976">
				<span>(orcid)</span>
			</a>
			<!-- ... -->
		</div>
	</svelte:fragment>
</AppBar>

	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
<Navigation/>
	</svelte:fragment>

	<slot />

<svelte:fragment slot="footer">
	<p class="text-center">Built with Svelte and Stealth x</p>
</svelte:fragment>
</AppShell>