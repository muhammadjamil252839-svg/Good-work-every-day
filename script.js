// ==================================
// ABDULLAH ALOM COIN REWARD SYSTEM
// ==================================

// LOAD SAVED DATA

let coins = Number(localStorage.getItem("abdullahCoins")) || 0;

let historyList = [];

try {
    historyList = JSON.parse(
        localStorage.getItem("abdullahHistory")
    ) || [];
} catch {
    historyList = [];
}


// ==================================
// GOOD ACTIVITIES
// ==================================

const goodActivities = [

    "Perform Fajr Prayer",
    "Perform Dhuhr Prayer",
    "Perform Asr Prayer",
    "Perform Maghrib Prayer",
    "Perform Isha Prayer",

    "Read the Holy Quran",
    "Give Salam to Others",
    "Greet Your Parents with Salam",
    "Help Someone in Need",
    "Finish Class Homework",
    "Avoid Mischief",
    "Read the Sleeping Dua",
    "Read the Morning Dua",
    "Respect Your Parents",
    "Speak the Truth",
    "Help Your Friends",
    "Keep Your Room Clean",
    "Listen to Your Parents",
    "Respect Your Teachers",
    "Read Islamic Books",
    "Share with Others",
    "Keep Your Promises",
    "Study on Time",
    "Be Kind to Everyone",
    "Perform Sunnah Prayers"

];


// ==================================
// BAD ACTIVITIES
// ==================================

const badActivities = [

    "Miss Fajr Prayer",
    "Miss Dhuhr Prayer",
    "Miss Asr Prayer",
    "Miss Maghrib Prayer",
    "Miss Isha Prayer",

    "Do Not Read the Holy Quran",
    "Do Not Give Salam",
    "Do Not Greet Your Parents",
    "Refuse to Help Others",
    "Leave Homework Unfinished",
    "Do Mischief",
    "Skip the Sleeping Dua",
    "Skip the Morning Dua",
    "Disrespect Your Parents",
    "Tell Lies",
    "Fight with Friends",
    "Keep Your Room Messy",
    "Disobey Your Parents",
    "Disrespect Your Teachers",
    "Waste Study Time",
    "Refuse to Share",
    "Break Your Promises",
    "Play During Study Time",
    "Be Unkind to Others",
    "Skip Sunnah Prayers"

];


// ==================================
// COIN SOUND
// ==================================

let audioContext;

function playCoinSound(type) {

    try {

        audioContext = audioContext ||
            new (window.AudioContext ||
            window.webkitAudioContext)();

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        const now = audioContext.currentTime;

        if (type === "good") {

            // Beautiful coin sound

            oscillator.type = "sine";

            oscillator.frequency.setValueAtTime(1000, now);

            oscillator.frequency.exponentialRampToValueAtTime(
                1600, now + 0.12
            );

        } else {

            // Low coin deduction sound

            oscillator.type = "sine";

            oscillator.frequency.setValueAtTime(450, now);

            oscillator.frequency.exponentialRampToValueAtTime(
                250, now + 0.18
            );

        }

        gain.gain.setValueAtTime(0.2, now);

        gain.gain.exponentialRampToValueAtTime(
            0.001, now + 0.3
        );

        oscillator.start(now);
        oscillator.stop(now + 0.3);

    } catch (error) {
        console.log("Sound unavailable", error);
    }

}


// ==================================
// SAVE COINS
// ==================================

function updateCoins() {

    document.getElementById("coins").textContent = coins;

    localStorage.setItem("abdullahCoins", coins);

}


// ==================================
// SAVE HISTORY
// ==================================

function saveHistory() {

    localStorage.setItem(
        "abdullahHistory",
        JSON.stringify(historyList)
    );

    renderHistory();

}


// ==================================
// ADD COINS
// ==================================

function addCoins(activity) {

    coins += 5;

    updateCoins();

    playCoinSound("good");

    addHistory("+5", activity, "positive");

}


// ==================================
// REMOVE COINS
// ==================================

function removeCoins(activity) {

    if (coins < 2) {

        alert("Not enough coins!");

        return;

    }

    coins -= 2;

    updateCoins();

    playCoinSound("bad");

    addHistory("-2", activity, "negative");

}


// ==================================
// ADD ACTIVITY HISTORY
// ==================================

function addHistory(amount, activity, type) {

    historyList.unshift({

        amount: amount,

        activity: activity,

        type: type,

        date: new Date().toLocaleString()

    });

    // Keep latest 100 records

    historyList = historyList.slice(0, 100);

    saveHistory();

}


// ==================================
// SHOW ACTIVITY HISTORY
// ==================================

function renderHistory() {

    const historyDiv = document.getElementById("history");

    historyDiv.replaceChildren();

    if (historyList.length === 0) {

        const empty = document.createElement("p");

        empty.textContent = "No activities yet.";

        historyDiv.appendChild(empty);

        return;

    }

    historyList.forEach(item => {

        const row = document.createElement("div");

        row.className = "history-item " + item.type;

        row.textContent =
            item.amount + " Coins — " +
            item.activity + " | " +
            item.date;

        historyDiv.appendChild(row);

    });

}


// ==================================
// DISPLAY TASKS
// ==================================

function renderTasks() {

    const goodDiv = document.getElementById("goodTasks");

    const badDiv = document.getElementById("badTasks");


    goodActivities.forEach(activity => {

        const task = document.createElement("div");

        task.className = "task";

        const name = document.createElement("span");

        name.className = "task-name";

        name.textContent = "🌟 " + activity;


        const button = document.createElement("button");

        button.className = "good-btn";

        button.textContent = "+5 Coins";

        button.addEventListener("click", () => {

            addCoins(activity);

        });


        task.append(name, button);

        goodDiv.appendChild(task);

    });


    badActivities.forEach(activity => {

        const task = document.createElement("div");

        task.className = "task";

        const name = document.createElement("span");

        name.className = "task-name";

        name.textContent = "⚠️ " + activity;


        const button = document.createElement("button");

        button.className = "bad-btn";

        button.textContent = "-2 Coins";

        button.addEventListener("click", () => {

            removeCoins(activity);

        });


        task.append(name, button);

        badDiv.appendChild(task);

    });

}


// ==================================
// RESET ALL COINS
// ==================================

document.getElementById("resetButton")
    .addEventListener("click", () => {

        const confirmReset = confirm(
            "Are you sure you want to reset all coins and history?"
        );

        if (confirmReset) {

            coins = 0;

            historyList = [];

            updateCoins();

            saveHistory();

        }

    });


// ==================================
// START WEBSITE
// ==================================

renderTasks();

updateCoins();

renderHistory();
