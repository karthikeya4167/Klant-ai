const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const modeToggle = document.getElementById("mode-toggle");

function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;

    if (sender === 'bot') {
        const avatar = document.createElement('img');
        avatar.src = 'https://i.imgur.com/9N6b3tw.png'; // cute bot avatar
        msg.appendChild(avatar);
    }

    const span = document.createElement('span');
    span.innerHTML = text;
    msg.appendChild(span);

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    saveChat();
}

function sendMessage() {
    const userText = input.value.trim();
    if (userText === "") return;

    addMessage(userText, "user");
    input.value = "";

    showTypingIndicator();

    setTimeout(() => {
        getBotResponse(userText);
    }, 1000);
}

function showTypingIndicator() {
    const typing = document.createElement("div");
    typing.className = "message bot";
    typing.id = "typing-indicator";
    typing.innerHTML = "<em>Klant is typing...</em>";
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(userText) {
    const lower = userText.toLowerCase();
    let response = "Thinking deeply... Please wait.";

    if (lower.includes("error")) {
        response = "🔍 It looks like a syntax or logical error. Double-check your brackets, semicolons, and logs.";
    } else if (lower.includes("undefined")) {
        response = "💡 'undefined' means you're trying to use a variable that hasn't been assigned a value.";
    } else if (lower.includes("fetch") || lower.includes("api")) {
        response = "🌐 Make sure your API URL is correct and handle responses with `.then()` or `async/await`.";
    } else if (lower.includes("loop") || lower.includes("infinite")) {
        response = "🔁 Infinite loops often occur due to incorrect exit conditions — review your loop logic.";
    } else {
        response = "🤖 Could you please clarify your question or share a code snippet?";
    }

    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();

    addMessage(response, "bot");
}

function startVoiceInput() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
        input.value = event.results[0][0].transcript;
        sendMessage();
    };
}

function saveChat() {
    localStorage.setItem('nova_chat_history', chatBox.innerHTML);
}

function loadChat() {
    const history = localStorage.getItem('nova_chat_history');
    if (history) chatBox.innerHTML = history;
}

function downloadChat() {
    const element = document.createElement('a');
    const text = chatBox.innerText;
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "chat_history.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    modeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

window.onload = loadChat;
