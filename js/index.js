yearFooter.innerHTML = new Date().getFullYear();

toggleSettings.onclick = () => {
	settings.classList.toggle("open");
	if (settings.classList.contains("open")) {
		toggleSettings.setAttribute("aria-expanded", "true");
	} else {
		toggleSettings.setAttribute("aria-expanded", "false");
	}
};

closeSettings.onclick = () => {
	settings.classList.remove("open");
	toggleSettings.setAttribute("aria-expanded", "false");
};

setInterval(() => {
	updateTimeProgressBars();
}, 1000);

applySettings.onclick = () => {
	const birthdayInput = document.getElementById("birthday").value;
	if (birthdayInput) {
		localStorage.setItem("birthday", new Date(birthdayInput).toISOString());
		updateTimeProgressBars();
	}
};

const showHolidaysCheckbox = document.getElementById("showHolidays");
showHolidaysCheckbox.onchange = () => {
	localStorage.setItem("showHolidays", showHolidaysCheckbox.checked);
	updateTimeProgressBars();
};

const savedBirthday = localStorage.getItem("birthday");
if (savedBirthday) {
	const birthdayDate = new Date(savedBirthday);
	const birthdayInput = document.getElementById("birthday");
	const formattedDate = birthdayDate.toISOString().split("T")[0];
	birthdayInput.value = formattedDate;
}

const savedShowHolidays = localStorage.getItem("showHolidays");
if (savedShowHolidays !== null) {
	showHolidaysCheckbox.checked = savedShowHolidays === "true";
}

// Custom Events functionality
function getCustomEvents() {
	const events = localStorage.getItem("customEvents");
	return events ? JSON.parse(events) : [];
}

function saveCustomEvents(events) {
	localStorage.setItem("customEvents", JSON.stringify(events));
}

function renderCustomEventsList() {
	const customEventsList = document.getElementById("customEventsList");
	const events = getCustomEvents();

	if (events.length === 0) {
		customEventsList.innerHTML = '<p style="font-size: 1.2rem; color: var(--text-muted-color); margin-top: 1rem;">No custom events yet</p>';
		return;
	}

	customEventsList.innerHTML = '<h4 style="margin-top: 1.5rem; margin-bottom: 0.5rem;">Your Events:</h4>';
	events.forEach((event, index) => {
		const eventDiv = document.createElement("div");
		eventDiv.className = "customEventItem";
		eventDiv.innerHTML = `
			<span>${event.name}</span>
			<button class="deleteEvent" data-index="${index}" aria-label="Delete ${event.name}">
				<i class="fas fa-trash"></i>
			</button>
		`;
		customEventsList.appendChild(eventDiv);
	});

	// Add delete event listeners
	document.querySelectorAll(".deleteEvent").forEach((btn) => {
		btn.onclick = () => {
			const index = parseInt(btn.getAttribute("data-index"));
			const events = getCustomEvents();
			events.splice(index, 1);
			saveCustomEvents(events);
			renderCustomEventsList();
			renderCustomProgressBars();
		};
	});
}

function renderCustomProgressBars() {
	const customProgressBars = document.getElementById("customProgressBars");
	const events = getCustomEvents();

	if (events.length === 0) {
		customProgressBars.innerHTML = "";
		return;
	}

	customProgressBars.innerHTML = '<h2 style="margin-top: 3rem; margin-bottom: 1.5rem;">Custom Events</h2>';

	events.forEach((event, index) => {
		const article = document.createElement("article");
		article.id = `custom-${index}`;
		article.innerHTML = `
			<div class="details">
				<h2 class="title">${event.name}</h2>
				<p class="timeLeft">Calculating...</p>
			</div>
			<div class="progressContainer">
				<div class="progressBar" id="customBar-${index}"></div>
				<span id="customPercentage-${index}">0%</span>
			</div>
		`;
		customProgressBars.appendChild(article);
	});
}

document.getElementById("addCustomEvent").onclick = () => {
	const nameInput = document.getElementById("customEventName");
	const dateInput = document.getElementById("customEventDate");

	const name = nameInput.value.trim();
	const dateTimeStr = dateInput.value;

	if (!name || !dateTimeStr) {
		alert("Please enter both event name and date/time");
		return;
	}

	const events = getCustomEvents();
	events.push({
		name: name,
		dateTime: new Date(dateTimeStr).toISOString(),
		createdAt: new Date().toISOString(),
	});
	saveCustomEvents(events);

	nameInput.value = "";
	dateInput.value = "";

	renderCustomEventsList();
	renderCustomProgressBars();
	updateTimeProgressBars();
};

// Initialize custom events
renderCustomEventsList();
renderCustomProgressBars();

updateTimeProgressBars();

function updateTimeProgressBars() {
	const birthdayStr = localStorage.getItem("birthday");
	const birthday = birthdayStr ? new Date(birthdayStr) : null;
	const now = new Date();
	const showHolidays = localStorage.getItem("showHolidays") !== "false";

	const holidayBars = ["halloweenBar", "christmasBar", "valentineBar", "fridayThe13thBar"];

	document.querySelectorAll(".progressBar").forEach((bar) => {
		if (holidayBars.includes(bar.id)) {
			const article = bar.closest("article");
			if (article && showHolidays !== null) {
				article.style.display = showHolidays ? "" : "none";
			}
			if (!showHolidays) return;
		}
		let startDate, endDate;

		switch (bar.id) {
			case "minuteBar":
				startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0);
				endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0);
				break;
			case "hourBar":
				startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0);
				endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
				break;
			case "dayBar":
				startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
				break;
			case "weekBar":
				const dayOfWeek = now.getDay();
				startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
				endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - dayOfWeek));
				break;
			case "monthBar":
				startDate = new Date(now.getFullYear(), now.getMonth(), 1);
				endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
				break;
			case "quarterEndBar":
				const currentMonth = now.getMonth();
				const currentQuarter = Math.floor(currentMonth / 3) + 1;
				const quarterEndMonth = currentQuarter * 3;
				startDate = new Date(now.getFullYear(), quarterEndMonth - 3, 1);
				endDate = new Date(now.getFullYear(), quarterEndMonth, 1);
				break;
			case "yearBar":
				startDate = new Date(now.getFullYear(), 0, 1);
				endDate = new Date(now.getFullYear() + 1, 0, 1);
				break;
			case "decadeBar":
				const decadeStartYear = Math.floor(now.getFullYear() / 10) * 10;
				startDate = new Date(decadeStartYear, 0, 1);
				endDate = new Date(decadeStartYear + 10, 0, 1);
				break;
			case "halloweenBar":
				const halloweenThisYear = new Date(now.getFullYear(), 9, 31);
				if (now < halloweenThisYear) {
					startDate = new Date(now.getFullYear() - 1, 9, 31);
					endDate = halloweenThisYear;
				} else {
					startDate = halloweenThisYear;
					endDate = new Date(now.getFullYear() + 1, 9, 31);
				}
				break;
			case "christmasBar":
				const currentYear = now.getFullYear();
				const christmasThisYear = new Date(currentYear, 11, 25);
				if (now < christmasThisYear) {
					startDate = new Date(currentYear - 1, 11, 25);
					endDate = christmasThisYear;
				} else {
					startDate = christmasThisYear;
					endDate = new Date(currentYear + 1, 11, 25);
				}
				break;
			case "valentineBar":
				const valentineThisYear = new Date(now.getFullYear(), 1, 14);
				if (now < valentineThisYear) {
					startDate = new Date(now.getFullYear() - 1, 1, 14);
					endDate = valentineThisYear;
				} else {
					startDate = valentineThisYear;
					endDate = new Date(now.getFullYear() + 1, 1, 14);
				}
				break;
			case "fridayThe13thBar":
				const findNextFridayThe13th = (fromDate) => {
					let year = fromDate.getFullYear();
					let month = fromDate.getMonth();

					for (let i = 0; i < 24; i++) {
						const testDate = new Date(year, month, 13);
						if (testDate > fromDate && testDate.getDay() === 5) {
							return testDate;
						}
						month++;
						if (month > 11) {
							month = 0;
							year++;
						}
					}
					return null;
				};

				const findPrevFridayThe13th = (fromDate) => {
					let year = fromDate.getFullYear();
					let month = fromDate.getMonth();

					for (let i = 0; i < 24; i++) {
						const testDate = new Date(year, month, 13);
						if (testDate < fromDate && testDate.getDay() === 5) {
							return testDate;
						}
						month--;
						if (month < 0) {
							month = 11;
							year--;
						}
					}
					return null;
				};

				endDate = findNextFridayThe13th(now);
				startDate = findPrevFridayThe13th(now) || findPrevFridayThe13th(endDate);
				break;
			case "lifetimeBar":
				if (birthday) {
					startDate = birthday;
					endDate = new Date(startDate.getFullYear() + 70, startDate.getMonth(), startDate.getDate());
				} else {
					bar.style.width = "0%";
					document.getElementById("lifetimePercentage").innerText = "N/A";
					document.querySelector("#lifetime .timeLeft").innerText = "Set your birthday in settings";
					return;
				}
				break;
			case "birthdayBar":
				if (birthday) {
					const birthDateThisYear = new Date(now.getFullYear(), birthday.getMonth(), birthday.getDate());

					const isBirthday = now.getMonth() === birthday.getMonth() && now.getDate() === birthday.getDate();

					if (now < birthDateThisYear) {
						startDate = new Date(now.getFullYear() - 1, birthday.getMonth(), birthday.getDate());
						endDate = birthDateThisYear;
					} else {
						startDate = birthDateThisYear;
						endDate = new Date(now.getFullYear() + 1, birthday.getMonth(), birthday.getDate());
					}

					if (isBirthday) {
						document.querySelector("#birthday .timeLeft").innerHTML = "🎉 <strong>Happy Birthday!</strong> 🎂";
						document.querySelector("#birthday .timeLeft").style.color = "#FFD700";
						document.querySelector("#birthday .timeLeft").style.fontWeight = "bold";
					}
				} else {
					bar.style.width = "0%";
					document.getElementById("birthdayPercentage").innerText = "N/A";
					document.querySelector("#birthday .timeLeft").innerText = "Set your birthday in settings";
					return;
				}
				break;
			default:
				return;
		}

		const totalDuration = endDate - startDate;
		const elapsedDuration = now - startDate;
		const percentage = Math.min(Math.max(elapsedDuration / totalDuration, 0), 1) * 100;

		bar.style.width = percentage + "%";

		const percentageTextId = bar.id.replace("Bar", "Percentage");
		document.getElementById(percentageTextId).innerText = percentage.toFixed(1) + "%";

		if (bar.id === "birthdayBar") {
			const birthdayStr = localStorage.getItem("birthday");
			const isBirthdayToday = birthdayStr && now.getMonth() === new Date(birthdayStr).getMonth() && now.getDate() === new Date(birthdayStr).getDate();

			if (!isBirthdayToday) {
				document.querySelector("#birthday .timeLeft").style.color = "";
				document.querySelector("#birthday .timeLeft").style.fontWeight = "";
			}
		}

		const timeLeftMs = endDate - now;
		const timeUnits = [
			{ label: "y", value: 1000 * 60 * 60 * 24 * 365 },
			{ label: "mo", value: 1000 * 60 * 60 * 24 * 30 },
			{ label: "w", value: 1000 * 60 * 60 * 24 * 7 },
			{ label: "d", value: 1000 * 60 * 60 * 24 },
			{ label: "h", value: 1000 * 60 * 60 },
			{ label: "m", value: 1000 * 60 },
			{ label: "s", value: 1000 },
		];
		let timeLeftStr = "";
		let remainingTime = timeLeftMs;

		for (const unit of timeUnits) {
			const unitValue = Math.floor(remainingTime / unit.value);
			if (unitValue > 0) {
				timeLeftStr += `${unitValue}${unit.label} `;
			}
			remainingTime %= unit.value;
		}

		const timeLeftElementId = bar.id.replace("Bar", "");
		document.querySelector(`#${timeLeftElementId} .timeLeft`).innerText = timeLeftStr.trim().length > 0 ? timeLeftStr.trim() + " left" : "0s left";
	});

	// Update custom progress bars
	const customEvents = getCustomEvents();
	customEvents.forEach((event, index) => {
		const bar = document.getElementById(`customBar-${index}`);
		if (!bar) return;

		const eventDate = new Date(event.dateTime);
		// Use the stored createdAt, or default to the beginning of today
		const createdDate = event.createdAt ? new Date(event.createdAt) : new Date(new Date().setHours(0, 0, 0, 0));
		const now = new Date();

		// Check if event has passed
		if (now >= eventDate) {
			bar.style.width = "100%";
			document.getElementById(`customPercentage-${index}`).innerText = "100%";
			document.querySelector(`#custom-${index} .timeLeft`).innerHTML = "🎉 <strong>Event reached!</strong>";
			document.querySelector(`#custom-${index} .timeLeft`).style.color = "#FFD700";
			document.querySelector(`#custom-${index} .timeLeft`).style.fontWeight = "bold";
			return;
		}

		// Calculate progress from creation date to event date
		const totalDuration = eventDate - createdDate;
		const elapsedDuration = now - createdDate;
		const percentage = Math.min(Math.max(elapsedDuration / totalDuration, 0), 1) * 100;

		bar.style.width = percentage + "%";
		document.getElementById(`customPercentage-${index}`).innerText = percentage.toFixed(1) + "%";

		// Calculate time left
		const timeLeftMs = eventDate - now;
		const timeUnits = [
			{ label: "y", value: 1000 * 60 * 60 * 24 * 365 },
			{ label: "mo", value: 1000 * 60 * 60 * 24 * 30 },
			{ label: "w", value: 1000 * 60 * 60 * 24 * 7 },
			{ label: "d", value: 1000 * 60 * 60 * 24 },
			{ label: "h", value: 1000 * 60 * 60 },
			{ label: "m", value: 1000 * 60 },
			{ label: "s", value: 1000 },
		];
		let timeLeftStr = "";
		let remainingTime = timeLeftMs;

		for (const unit of timeUnits) {
			const unitValue = Math.floor(remainingTime / unit.value);
			if (unitValue > 0) {
				timeLeftStr += `${unitValue}${unit.label} `;
			}
			remainingTime %= unit.value;
		}

		const timeLeftElement = document.querySelector(`#custom-${index} .timeLeft`);
		timeLeftElement.innerText = timeLeftStr.trim().length > 0 ? timeLeftStr.trim() + " left" : "0s left";
		timeLeftElement.style.color = "";
		timeLeftElement.style.fontWeight = "";
	});
}
