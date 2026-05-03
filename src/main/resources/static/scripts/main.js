const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user-msg');
    userInput.value = '';

    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();
        typeEffect(data.response, 'bot-msg');
    } catch (err) {
        appendMessage("Connection lost. Retrying...", 'bot-msg');
    }
}

function appendMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `msg ${type}`;
    msg.innerText = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function typeEffect(text, type) {
    const msg = document.createElement('div');
    msg.className = `msg ${type}`;
    chatWindow.appendChild(msg);

    let i = 0;
    const interval = setInterval(() => {
        msg.innerText += text[i];
        i++;
        if (i >= text.length) clearInterval(interval);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 15);
}

sendBtn.addEventListener('click', sendMessage);