const ID = "710856373675491381";
const MONITOR_URL = "https://api.lanyard.rest/v1/users/";

const STATUS = {
	online: "--syntax-string",
	idle: "--syntax-regex",
	dnd: "--syntax-number",
	offline: "--syntax-operator",
};

const STATUSNAME = {
	online: "Online",
	idle: "Idle",
	dnd: "Do Not Disturb",
	offline: "Offline",
};

function discordImageURL(image) {
	if (!image?.startsWith("mp:"))
		return image;

	return `https://media.discordapp.net/${image.slice(3)}`;
}

async function createDiscordStatus() {
	let data;

	try {
		const response = await fetch(MONITOR_URL + ID);

		if (!response.ok)
			throw new Error(`Lanyard returned HTTP ${response.status}`);

		const json = await response.json();

		if (!json.success || !json.data)
			throw new Error("Lanyard returned an unsuccessful response");

		const d = json.data;
		const spotify = d.spotify;

		data = {
			status: STATUS[d.discord_status] ? d.discord_status : null,

			spotify: spotify && {
				song: spotify.song,
				artist: spotify.artist,
				album: spotify.album,
				artwork: spotify.album_art_url,
			},

			activity: d.activities?.find(a => a.name !== "Spotify"),
		};
	} catch (error) {
		console.error("Failed to fetch Discord status:", error);
		return null;
	}

	const root = element("div", "discord-status");

	// DOM helpers.
	function element(tag, className, text) {
		const el = document.createElement(tag);

		if (className)
			el.className = className;

		if (text != null)
			el.textContent = text;

		return el;
	}

	function addText(parent, className, value) {
		if (value)
			parent.append(element("span", className, value));
	}

	function addImage(parent, src, title) {
		if (!src)
			return;

		const image = element("img", "discord-status__artwork");
		image.src = src;
		image.alt = "";
		image.loading = "lazy";

		if (title)
			image.title = title;

		parent.append(image);
	}

	function addSection(image, title, subtitle, muted) {
		const section = element("div", "discord-status__section");
		const info = element("div", "discord-status__info");

		if (image)
			addImage(section, image.src, image.title);

		addText(info, "discord-status__title", title);
		addText(info, "discord-status__subtitle", subtitle);
		addText(info, "discord-status__muted", muted);

		section.append(info);
		root.append(section);
	}

	// Presence.
	if (data.status) {
		const status = element("div", "discord-status__presence");
		const dot = element("span", "discord-status__dot");

		dot.style.color = `var(${STATUS[data.status]})`;

		status.append(dot);
		addText(status, "discord-status__label", STATUSNAME[data.status]);
		root.append(status);
	}

	// Spotify.
	if (data.spotify) {
		const s = data.spotify;

		addSection(
			s.artwork && { src: s.artwork, title: s.album },
			s.song,
			s.artist,
		);
	}

	// Other activity.
	if (data.activity) {
		const a = data.activity;

		const image = a.assets?.large_image
			? discordImageURL(a.assets.large_image)
			: a.application_id === "1428212113620603042"
				? "https://cdn.discordapp.com/app-icons/1428212113620603042/25ff0b8bd5c5910121d5d8bf6c87e1d7.png?size=160&keep_aspect_ratio=false"
				: null;

		addSection(
			image && {
				src: image,
				title: a.assets?.large_text || a.name,
			},
			a.name,
			a.details,
			a.state,
		);
	}

	return root;
}
