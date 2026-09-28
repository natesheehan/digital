/** Fade/slide an element in the first time it scrolls into view. */
export function reveal(node: HTMLElement, delay = 0) {
	node.classList.add('reveal');
	node.style.setProperty('--reveal-delay', `${delay}ms`);

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('is-visible');
					io.disconnect();
				}
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
	);
	io.observe(node);

	return {
		destroy: () => io.disconnect()
	};
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@._#%&0123456789';

/** Decode an element's text from random glyphs; replays on hover. */
export function scramble(node: HTMLElement, text: string) {
	let timer: ReturnType<typeof setInterval> | undefined;
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function run() {
		if (reduce) {
			node.textContent = text;
			return;
		}
		let iteration = 0;
		clearInterval(timer);
		timer = setInterval(() => {
			node.textContent = text
				.split('')
				.map((ch, i) => (i < iteration ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
				.join('');
			if (iteration >= text.length) clearInterval(timer);
			iteration += 1 / 2;
		}, 28);
	}

	const io = new IntersectionObserver((entries) => {
		if (entries.some((e) => e.isIntersecting)) {
			run();
			io.disconnect();
		}
	});
	io.observe(node);
	node.addEventListener('mouseenter', run);

	return {
		destroy() {
			clearInterval(timer);
			io.disconnect();
			node.removeEventListener('mouseenter', run);
		}
	};
}
