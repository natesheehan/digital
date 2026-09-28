<script lang="ts">
	export let name:
		| 'github'
		| 'orcid'
		| 'twitter'
		| 'scholar'
		| 'mail'
		| 'arrow'
		| 'external'
		| 'open'
		| 'copy'
		| 'check'
		| 'download'
		| 'sun'
		| 'moon'
		| 'menu'
		| 'close';
	export let size = 16;
</script>

{#if name === 'orcid'}
	<svg width={size} height={size} viewBox="0 0 256 256" aria-hidden="true">
		<circle cx="128" cy="128" r="128" fill="currentColor" />
		<g fill="var(--bg)">
			<rect x="71" y="78" width="17" height="102" />
			<circle cx="79.5" cy="59.5" r="10.5" />
			<path
				d="M109 78h45.6c43.4 0 62.5 31 62.5 51 0 21.8-17.2 51-62.3 51H109V78zm17 86.7h27.1c38.6 0 47.4-29.3 47.4-35.7 0-10.8-6.9-35.8-46.5-35.8H126v71.5z"
			/>
		</g>
	</svg>
{:else}
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.6"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class={$$props.class}
	>
		{#if name === 'github'}
			<path
				fill="currentColor"
				stroke="none"
				d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.76 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
			/>
		{:else if name === 'twitter'}
			<path
				fill="currentColor"
				stroke="none"
				d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.32l4.37 5.78L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z"
			/>
		{:else if name === 'scholar'}
			<path d="M12 4 2 10l10 6 10-6-10-6Z" />
			<path d="M6 12.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 10v5" />
		{:else if name === 'mail'}
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<path d="m3.5 6.5 8.5 6 8.5-6" />
		{:else if name === 'arrow'}
			<path d="M5 12h14M13 6l6 6-6 6" />
		{:else if name === 'external'}
			<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
		{:else if name === 'open'}
			<!-- open-access padlock -->
			<rect x="5" y="11" width="14" height="10" rx="2" />
			<path d="M8 11V7a4 4 0 0 1 7.75-1.4" />
			<circle cx="12" cy="16" r="1.4" fill="currentColor" />
		{:else if name === 'copy'}
			<rect x="9" y="9" width="11" height="11" rx="2" />
			<path d="M5 15V5a1 1 0 0 1 1-1h10" />
		{:else if name === 'check'}
			<path d="m5 12.5 4.5 4.5L19 7.5" />
		{:else if name === 'download'}
			<path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
		{:else if name === 'sun'}
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
			/>
		{:else if name === 'moon'}
			<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
		{:else if name === 'menu'}
			<path d="M4 7h16M4 12h16M4 17h16" />
		{:else if name === 'close'}
			<path d="M6 6l12 12M18 6 6 18" />
		{/if}
	</svg>
{/if}
