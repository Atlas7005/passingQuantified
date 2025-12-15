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
}, 100);

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
    const birthday = new Date(localStorage.getItem("birthday"));
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
            case "yearBar":
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear() + 1, 0, 1);
                break;
            case "decadeBar":
                const decadeStartYear = Math.floor(now.getFullYear() / 10) * 10;
                startDate = new Date(decadeStartYear, 0, 1);
                endDate = new Date(decadeStartYear + 10, 0, 1);
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
        document.getElementById(percentageTextId).innerText = parseInt(percentage) + "%";

        const isBirthdayToday = now.getMonth() === new Date(localStorage.getItem("birthday")).getMonth() &&
            now.getDate() === new Date(localStorage.getItem("birthday")).getDate();

        if (!isBirthdayToday) {
            document.querySelector("#birthday .timeLeft").style.color = "";
            document.querySelector("#birthday .timeLeft").style.fontWeight = "";

            const timeLeftMs = endDate - now;
            const timeUnits = [
                { label: 'y', value: 1000 * 60 * 60 * 24 * 365 },
                { label: 'm', value: 1000 * 60 * 60 * 24 * 30 },
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

            const timeLeftElementId = bar.id.replace("Bar", "");;
            document.querySelector(`#${timeLeftElementId} .timeLeft`).innerText = timeLeftStr.trim().length > 0 ? timeLeftStr.trim() + " left" : "0s left";
        }
    });
}