// thanks alot @Nykenik24 on GitHub imma just steal this rq :P
// this has some modifications, like how icons are handled, seasonal themes (halloween, christmas, aqua (summer only) yada yada)

(() => {
	const button = document.getElementById("theme-toggle");
	const buttonText = document.querySelector("#theme-toggle>span");
	const root = document.documentElement;

	const themes = [
		{
			id: "default",
			name: "Default Dark",
			colorScheme: "default",
		},
		{
			id: "high_contrast",
			name: "High Contrast",
			colorScheme: "high_contrast"
		},
		{
			id: "light",
			name: "Default Light",
			colorScheme: "light",
		},
		{
			id: "high_contrast_light",
			name: "Light Contrast",
			colorScheme: "high_contrast_light"
		},
		{
			id: "paper",
			name: "Pen & Paper",
			colorScheme: "paper"
		},
		{
			id: "haxxor",
			name: "1337 Haxxor",
			colorScheme: "haxxor"
		},
		{
			id: "aqua",
			name: "Aquatic",
			colorScheme: "aqua"
		},
		{
			id: "halloween",
			name: "Spooky",
			colorScheme: "halloween"
		},
		{
			id: "christmas",
			name: "Holly Jolly",
			colorScheme: "christmas"
		},
	];

	const availableThemes = themes.filter(theme => isThemeAvailable(theme.id));
	const defaultTheme = "default";

	function isThemeAvailable(id) {
		const now = new Date();

		const month = now.getMonth(); // 0 = Jan
		const day = now.getDate();

		switch (id) {
			case "halloween":
				return month === 9; // October

			case "christmas":
				return month === 11 || (month === 0 && day <= 6);

			case "aqua":
				return month >= 5 && month <= 7; // Jun-Aug

			default:
				return true;
		}
	}

	function getThemeIndex(id) {
		return availableThemes.findIndex(theme => theme.id === id);
	}

	function setTheme(theme) {
		root.dataset.theme = theme.id;
		root.style.colorScheme = theme.colorScheme;

		button.title = theme.name;
		buttonText.textContent = theme.name;
		localStorage.setItem("theme", theme.id);
	}

	function loadTheme() {
		const saved = localStorage.getItem("theme");
		const theme = themes.find(theme => theme.id === saved)
			?? themes.find(theme => theme.id === defaultTheme)
			?? themes[0];

		setTheme(theme);
	}

	function nextTheme() {
		const current = getThemeIndex(root.dataset.theme);

		const next = availableThemes[
			(current + 1) % availableThemes.length
		];

		setTheme(next);
	}

	function previousTheme() {
		const current = getThemeIndex(root.dataset.theme);

		const previous = availableThemes[
			(current - 1 + availableThemes.length) % availableThemes.length
		];

		setTheme(previous);
	}

	button.addEventListener("click", nextTheme);

	button.addEventListener("contextmenu", event => {
		event.preventDefault();
		previousTheme();
	});

	loadTheme();
})();
