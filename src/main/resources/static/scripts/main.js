const app = {
    // Backend URL. Uses relative path to work seamlessly on Railway.
    apiUrl: '/api/chat',
    
    // Navigate to ECI Links based on action
    nav(action) {
        const links = {
            check: "https://electoralsearch.eci.gov.in/",
            update: "https://voters.eci.gov.in/form8",
            id: "https://voters.eci.gov.in/",
            booth: "https://electoralsearch.eci.gov.in/pollingstation"
        };
        if (links[action]) {
            window.open(links[action], '_blank');
        }
    },

    // AI Chat Toggle
    toggleChat() {
        const chat = document.getElementById('ai-chat-overlay');
        chat.classList.toggle('hidden');
        if (!chat.classList.contains('hidden')) {
            document.getElementById('user-input').focus();
        }
    },

    // Handle Enter Key for Input
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    },

    // Send Message to Backend
    async sendMessage() {
        const inputField = document.getElementById('user-input');
        const userText = inputField.value.trim();
        if (userText === "") return;

        const display = document.getElementById('chat-display');

        // Add User Message
        const userMsg = document.createElement('div');
        userMsg.className = "message user-msg";
        userMsg.innerHTML = `<div class="msg-content">${this.escapeHTML(userText)}</div>`;
        display.appendChild(userMsg);
        
        inputField.value = "";
        this.scrollToBottom();

        // Show Typing Indicator
        const typingId = 'typing-' + Date.now();
        const typingIndicator = document.createElement('div');
        typingIndicator.id = typingId;
        typingIndicator.className = "typing-indicator";
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        display.appendChild(typingIndicator);
        this.scrollToBottom();

        try {
            // Fetch from Spring Boot AI Controller
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userText })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            
            // Remove typing indicator
            document.getElementById(typingId).remove();

            // Add Bot Message
            this.addBotMessage(data.response);

        } catch (error) {
            console.error("Error communicating with AI backend:", error);
            // Remove typing indicator
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();

            // Offline Fallback
            this.addBotMessage("I'm currently offline or unable to reach the election servers. Please try again later or visit eci.gov.in directly.");
        }
    },

    addBotMessage(text) {
        const display = document.getElementById('chat-display');
        const botMsg = document.createElement('div');
        botMsg.className = "message bot-msg";
        // To handle simple markdown or line breaks nicely if needed:
        const formattedText = this.escapeHTML(text).replace(/\n/g, '<br>');
        botMsg.innerHTML = `<div class="msg-content">${formattedText}</div>`;
        display.appendChild(botMsg);
        this.scrollToBottom();
    },

    scrollToBottom() {
        const display = document.getElementById('chat-display');
        display.scrollTop = display.scrollHeight;
    },

    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    }
};