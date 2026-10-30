(() => {
	const button = document.getElementById("font-toggle");
	const root = document.documentElement;

	const fonts = [
		{
			id: "default",
			name: "Default",
		},
		{
			id: "dyslexic",
			name: "Dyslexic",
		},
		{
			id: "agave",
			name: "Agave",
		},
		{
			id: "comic",
			name: "Comic Sans",
		},
	];

	const defaultFont = "default";

	function getFontIndex(id) {
		return fonts.findIndex(font => font.id === id);
	}

	function setFont(font) {
		root.dataset.font = font.id;

		button.dataset.alt = font.name;

		localStorage.setItem("font", font.id);
	}

	function loadFont() {
		const saved = localStorage.getItem("font");
		const font = fonts.find(font => font.id === saved)
			?? fonts.find(font => font.id === defaultFont)
			?? fonts[0];

		setFont(font);
	}

	function nextFont() {
		const current = getFontIndex(root.dataset.font);

		const next = fonts[
			(current + 1) % fonts.length
		];

		setFont(next);
	}

	function previousFont() {
		const current = getFontIndex(root.dataset.font);

		const previous = fonts[
			(current - 1 + fonts.length) % fonts.length
		];

		setFont(previous);
	}

	button.addEventListener("click", nextFont);

	button.addEventListener("contextmenu", event => {
		event.preventDefault();
		previousFont();
	});

	loadFont();
})();
