const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@._-";

function morph(element, target) {
	clearInterval(element._timer);

	const start = element.textContent;
	const duration = 300;
	const started = performance.now();

	element._timer = setInterval(() => {
		const progress = Math.min(1, (performance.now() - started) / duration);
		const length = Math.round(
			start.length + (target.length - start.length) * progress
		);

		let output = "";

		for (let i = 0; i < length; i++) {
			if (progress > i / Math.max(length, 1) + 0.2 && target[i]) {
				output += target[i];
			} else {
				output += CHARS[Math.floor(Math.random() * CHARS.length)];
			}
		}

		element.textContent = output;

		if (progress >= 1) {
			clearInterval(element._timer);
			element._timer = null;
			element.textContent = target;
		}
	}, 15);
}

for (const link of document.querySelectorAll(".morph")) {
	let original = link.textContent;
	let alternate = link.dataset.alt ?? original;
	let hovered = false;
	let rendered = link.textContent;

	function animate(target) {
		morph(link, target);
	}

	const observer = new MutationObserver(() => {
		const current = link.textContent;
		const newAlternate = link.dataset.alt ?? original;

		if (newAlternate !== alternate) {
			alternate = newAlternate;
			animate(hovered ? alternate : original);
			return;
		}

		if (current !== rendered && current !== original && current !== alternate) {
			original = current;
			animate(hovered ? alternate : original);
		}

		rendered = link.textContent;
	});

	observer.observe(link, {
		attributes: true,
		attributeFilter: ["data-alt"],
	});

	link.addEventListener("mouseenter", () => {
		hovered = true;
		alternate = link.dataset.alt ?? original;
		animate(alternate);
	});

	link.addEventListener("mouseleave", () => {
		hovered = false;
		animate(original);
	});

	link.setAttribute("data-original", original);
}
