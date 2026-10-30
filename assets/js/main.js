const menuOpen = document.getElementById("menu-open");
const menu = document.getElementById("menu");
const menuClose = document.getElementById("menu-close");

if (menu && menuOpen && menuClose) {
	menuOpen.addEventListener("click", () => menu.classList.add("open"));
	menuClose.addEventListener("click", () => menu.classList.remove("open"));
}


const elements = document.querySelectorAll(".my-age")

const bday = new Date("2010-05-11T00:00:00");

const updateAge = () => {
	const currentDate = new Date();

	let years = currentDate.getFullYear() - bday.getFullYear();
	let months = currentDate.getMonth() - bday.getMonth();
	let days = currentDate.getDate() - bday.getDate();

	// Borrow days from previous month
	if (days < 0) {
		months--;

		const prevMonth = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			0
		);
		days += prevMonth.getDate();
	}

	// Borrow months from previous year
	if (months < 0) {
		years--;
		months += 12;
	}

	// Calculate time since birthday
	const elapsed = currentDate - new Date(
		bday.getFullYear() + years,
		bday.getMonth() + months,
		bday.getDate()
	);

	let remaining = Math.max(0, elapsed);

	const weeks = Math.floor(days / 7);
	days %= 7;

	const hours = Math.floor(remaining / 3_600_000) % 24;
	const minutes = Math.floor(remaining / 60_000) % 60;
	const seconds = Math.floor(remaining / 1_000) % 60;

	let nextBirthday = new Date(bday);
	nextBirthday.setFullYear(currentDate.getFullYear());

	if (currentDate > nextBirthday) {
		nextBirthday.setFullYear(currentDate.getFullYear() + 1);
	}

	const daysLeft = Math.floor(
		(nextBirthday - currentDate) / 86_400_000
	);

	const units = [
		[years, "yr"],
		[months, "mon"],
		[weeks, "wk"],
		[days, "d"],
		[hours, "hr"],
		[minutes, "min"],
		[seconds, "sec"],
	];

	const age = units
		.filter(([value]) => value !== 0)
		.map(([value, unit]) => `${value}${unit}`)
		.join(" ");

	elements.forEach((e) => {
		e.textContent = age;
		e.title = `${daysLeft} day${daysLeft !== 1 ? "s" : ""} until next birthday`;
	});

	requestAnimationFrame(updateAge);
};

updateAge();
