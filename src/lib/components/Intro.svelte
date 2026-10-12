<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * First-load intro: plays /intro.mp4 (encoded from 20230128155825.gif) full screen.
	 * With reduced motion it holds on the first frame. Click, any key, or the video ending
	 * lets you into the site. Shown once per browser session; app.html sets html[data-intro]
	 * before first paint so the site never flashes underneath.
	 */
	const KEY = 'intro-seen';

	let show = false;
	let leaving = false;
	let reduce = false;
	let video: HTMLVideoElement;

	function enter() {
		if (leaving) return;
		leaving = true;
		try {
			sessionStorage.setItem(KEY, '1');
		} catch (e) {}
		video?.pause();
		delete document.documentElement.dataset.intro;
		setTimeout(() => (show = false), 500);
	}

	onMount(() => {
		reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		show = document.documentElement.dataset.intro === '1';
		if (!show) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			e.preventDefault();
			enter();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

{#if show}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div class="intro" class:leaving on:click={enter}>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			bind:this={video}
			src="/intro.mp4"
			poster="/intro-poster.jpg"
			autoplay={!reduce}
			muted
			playsinline
			preload="auto"
			on:ended={enter}
			on:error={enter}
		/>
		<button class="enter" on:click|stopPropagation={enter}>click to enter ↵</button>
	</div>
{/if}

<style>
	.intro {
		position: fixed;
		inset: 0;
		z-index: 300;
		display: grid;
		place-items: center;
		background: #000;
		cursor: pointer;
		transition: opacity 0.5s ease;
	}
	.intro.leaving {
		opacity: 0;
		pointer-events: none;
	}
	video {
		width: min(100vw, 100vh);
		height: min(100vw, 100vh);
		object-fit: contain;
	}
	.enter {
		position: absolute;
		left: 50%;
		bottom: clamp(16px, 5vh, 48px);
		transform: translateX(-50%);
		padding: 6px 14px;
		border: 1px solid #555;
		background: #000;
		color: #d7dad8;
		font-family: 'DejaVu Sans Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		cursor: pointer;
		animation: pulse 1.6s steps(1) infinite;
	}
	.enter:hover,
	.enter:focus-visible {
		background: #d7dad8;
		color: #000;
		animation: none;
	}
	@keyframes pulse {
		50% {
			opacity: 0.4;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.enter {
			animation: none;
		}
	}
</style>
