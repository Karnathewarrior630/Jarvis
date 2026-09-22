// ==========================================
// J.A.R.V.I.S. CORE
// ==========================================

const micButton = document.getElementById("micButton");
const statusText = document.getElementById("status");

const userText = document.getElementById("userText");
const jarvisText = document.getElementById("jarvisText");

const clock = document.getElementById("clock");
const time = document.getElementById("time");

const network = document.getElementById("network");
const voice = document.getElementById("voice");

// ==========================================
// CLOCK
// ==========================================

function updateClock() {

    const now = new Date();

    const timeString = now.toLocaleTimeString();

    clock.textContent = timeString;

    time.textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

setInterval(updateClock, 1000);

updateClock();


// ==========================================
// NETWORK STATUS
// ==========================================

function updateNetwork() {

    if (navigator.onLine) {
        network.textContent = "ONLINE";
    } else {
        network.textContent = "OFFLINE";
    }
}

window.addEventListener("online", updateNetwork);
window.addEventListener("offline", updateNetwork);

updateNetwork();


// ==========================================
// SPEECH RECOGNITION
// ==========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    voice.textContent = "READY";

} else {

    voice.textContent = "UNSUPPORTED";

}


// ==========================================
// START LISTENING
// ==========================================

micButton.addEventListener("click", () => {

    if (!recognition) {

        jarvisSpeak(
            "Sorry sir. Voice recognition is not supported in this browser."
        );

        return;
    }

    try {

        recognition.start();

    } catch (error) {

        console.log(error);

    }

});


// ==========================================
// RECOGNITION EVENTS
// ==========================================

if (recognition) {

    recognition.onstart = () => {

        statusText.textContent = "LISTENING...";

        micButton.textContent = "🔴 LISTENING";

        micButton.classList.add("listening");

        voice.textContent = "LISTENING";
    };


    recognition.onresult = (event) => {

        const command =
            event.results[0][0].transcript
                .toLowerCase()
                .trim();

        userText.textContent = command;

        processCommand(command);
    };


    recognition.onend = () => {

        statusText.textContent = "READY";

        micButton.textContent = "🎙 START JARVIS";

        micButton.classList.remove("listening");

        voice.textContent = "READY";
    };


    recognition.onerror = (event) => {

        console.log("Speech error:", event.error);

        statusText.textContent = "VOICE ERROR";

        micButton.classList.remove("listening");

        voice.textContent = "ERROR";

        setTimeout(() => {

            statusText.textContent = "READY";

            voice.textContent = "READY";

        }, 2000);
    };
}


// ==========================================
// COMMAND PROCESSOR
// ==========================================

function processCommand(command) {

    let response =
        "I am sorry sir. I do not understand that command.";

    // Greetings

    if (
        command.includes("hello") ||
        command.includes("hi") ||
        command.includes("hey")
    ) {

        response =
            "Hello sir. JARVIS is online and ready.";

    }


    // How are you

    else if (
        command.includes("how are you")
    ) {

        response =
            "All systems are operating normally, sir.";

    }


    // Who are you

    else if (
        command.includes("who are you") ||
        command.includes("what are you")
    ) {

        response =
            "I am JARVIS, your web based virtual assistant.";

    }


    // Time

    else if (
        command.includes("time")
    ) {

        response =
            "The current time is " +
            new Date().toLocaleTimeString();

    }


    // Date

    else if (
        command.includes("date") ||
        command.includes("today")
    ) {

        response =
            "Today is " +
            new Date().toLocaleDateString(
                undefined,
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );

    }


    // Open Google

    else if (
        command.includes("open google") ||
        command.includes("google")
    ) {

        response = "Opening Google, sir.";

        jarvisSpeak(response);

        setTimeout(() => {

            window.open(
                "https://www.google.com",
                "_blank"
            );

        }, 700);

        return;
    }


    // Open YouTube

    else if (
        command.includes("open youtube") ||
        command.includes("youtube")
    ) {

        response = "Opening YouTube, sir.";

        jarvisSpeak(response);

        setTimeout(() => {

            window.open(
                "https://www.youtube.com",
                "_blank"
            );

        }, 700);

        return;
    }


    // Search Google

    else if (
        command.startsWith("search ")
    ) {

        const searchQuery =
            command.replace("search ", "");

        response =
            "Searching Google for " +
            searchQuery;

        jarvisSpeak(response);

        setTimeout(() => {

            window.open(
                "https://www.google.com/search?q=" +
                encodeURIComponent(searchQuery),
                "_blank"
            );

        }, 700);

        return;
    }


    // Open GitHub

    else if (
        command.includes("open github") ||
        command.includes("github")
    ) {

        response = "Opening GitHub, sir.";

        jarvisSpeak(response);

        setTimeout(() => {

            window.open(
                "https://github.com",
                "_blank"
            );

        }, 700);

        return;
    }


    // Weather

    else if (
        command.includes("weather")
    ) {

        response =
            "I can open a weather search for you, sir.";

        jarvisSpeak(response);

        setTimeout(() => {

            window.open(
                "https://www.google.com/search?q=weather",
                "_blank"
            );

        }, 700);

        return;
    }


    // Stop

    else if (
        command.includes("stop") ||
        command.includes("shutdown")
    ) {

        response =
            "Voice response system paused, sir.";

        window.speechSynthesis.cancel();

    }


    // Thank you

    else if (
        command.includes("thank you") ||
        command.includes("thanks")
    ) {

        response =
            "You're welcome, sir.";

    }


    jarvisSpeak(response);
}


// ==========================================
// JARVIS VOICE
// ==========================================

function jarvisSpeak(text) {

    jarvisText.textContent = text;

    statusText.textContent = "SPEAKING...";

    if (!("speechSynthesis" in window)) {

        statusText.textContent = "READY";

        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    speech.rate = 0.95;

    speech.pitch = 0.9;

    speech.volume = 1;

    speech.onend = () => {

        statusText.textContent = "READY";

    };

    window.speechSynthesis.speak(speech);
}


// ==========================================
// INITIAL MESSAGE
// ==========================================

setTimeout(() => {

    jarvisSpeak(
        "JARVIS online. All primary systems are ready."
    );

}, 1000);
