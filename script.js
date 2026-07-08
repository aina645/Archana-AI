const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = "message " + sender;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) return;

    addMessage(message, "user");

    userInput.value = "";

    try {

        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        addMessage(data.reply, "ai");

    } catch (err) {

        addMessage("Server se connect nahi ho pa raha.", "ai");

        console.error(err);

    }

}

userInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});