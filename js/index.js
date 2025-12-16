year.innerHTML = new Date().getFullYear();

toggleSettings.onclick = () => {
    settings.classList.toggle("open");
    if (settings.classList.contains("open")) {
        toggleSettings.setAttribute("aria-expanded", "true");
    } else {
        toggleSettings.setAttribute("aria-expanded", "false");
    }
}

closeSettings.onclick = () => {
    settings.classList.remove("open");
    toggleSettings.setAttribute("aria-expanded", "false");
}

setInterval(() => {
    updateTimeProgressBars();
}, 1000);

applySettings.onclick = () => {
    const birthdayInput = document.getElementById("birthday").value;
    if (birthdayInput) {
        localStorage.setItem("birthday", new Date(birthdayInput).toISOString());
        updateTimeProgressBars();
    }
}

const savedBirthday = localStorage.getItem("birthday");
if (savedBirthday) {
    const birthdayDate = new Date(savedBirthday);
    const birthdayInput = document.getElementById("birthday");
    const formattedDate = birthdayDate.toISOString().split('T')[0];
    birthdayInput.value = formattedDate;
}

updateTimeProgressBars();

function updateTimeProgressBars() {
    const birthdayStr = localStorage.getItem("birthday");
    const birthday = birthdayStr ? new Date(birthdayStr) : null;
    const now = new Date();

    document.querySelectorAll(".progressBar").forEach(bar => {
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
                // Find next Friday the 13th
                const findNextFridayThe13th = (fromDate) => {
                    let year = fromDate.getFullYear();
                    let month = fromDate.getMonth();

                    // Check up to 24 months ahead (at least one Friday 13th must exist)
                    for (let i = 0; i < 24; i++) {
                        const testDate = new Date(year, month, 13);
                        if (testDate > fromDate && testDate.getDay() === 5) { // 5 = Friday
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

                // Find previous Friday the 13th
                const findPrevFridayThe13th = (fromDate) => {
                    let year = fromDate.getFullYear();
                    let month = fromDate.getMonth();

                    // Check up to 24 months back
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
            const isBirthdayToday = birthdayStr &&
                now.getMonth() === new Date(birthdayStr).getMonth() &&
                now.getDate() === new Date(birthdayStr).getDate();

            if (!isBirthdayToday) {
                document.querySelector("#birthday .timeLeft").style.color = "";
                document.querySelector("#birthday .timeLeft").style.fontWeight = "";
            }
        }

        const timeLeftMs = endDate - now;
        const timeUnits = [
            { label: 'y', value: 1000 * 60 * 60 * 24 * 365 },
            { label: 'mo', value: 1000 * 60 * 60 * 24 * 30 },
            { label: 'w', value: 1000 * 60 * 60 * 24 * 7 },
            { label: 'd', value: 1000 * 60 * 60 * 24 },
            { label: 'h', value: 1000 * 60 * 60 },
            { label: 'm', value: 1000 * 60 },
            { label: 's', value: 1000 }
        ];
        let timeLeftStr = '';
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
}