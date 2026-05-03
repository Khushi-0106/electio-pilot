const app = {
    apiUrl: '/api/chat',
    
    // --- 1. Personalized Timelines ---
    updateTimeline() {
        const state = document.getElementById('state-selector').value;
        const container = document.getElementById('timeline-container');
        
        let html = '';
        if (state === 'national') {
            html = `
                <div class="t-item done"><div class="t-date">APR 09</div><div class="t-details">Phase 1 Voting</div></div>
                <div class="t-item done"><div class="t-date">APR 23</div><div class="t-details">Phase 2 Voting</div></div>
                <div class="t-item active"><div class="t-date">MAY 04</div><div class="t-details">Result Counting</div></div>
            `;
        } else if (state === 'karnataka') {
            html = `
                <div class="t-item done"><div class="t-date">APR 09</div><div class="t-details">State Voting Day</div></div>
                <div class="t-item active"><div class="t-date">MAY 04</div><div class="t-details">Results Declared</div></div>
            `;
        } else if (state === 'tamil_nadu') {
            html = `
                <div class="t-item done"><div class="t-date">APR 23</div><div class="t-details">State Voting Day</div></div>
                <div class="t-item active"><div class="t-date">MAY 04</div><div class="t-details">Results Declared</div></div>
            `;
        } else if (state === 'maharashtra') {
            html = `
                <div class="t-item done"><div class="t-date">APR 09</div><div class="t-details">Phase 1 (Vidarbha)</div></div>
                <div class="t-item done"><div class="t-date">APR 23</div><div class="t-details">Phase 2 (Mumbai)</div></div>
                <div class="t-item active"><div class="t-date">MAY 04</div><div class="t-details">Results Declared</div></div>
            `;
        }
        
        container.style.opacity = 0;
        setTimeout(() => {
            container.innerHTML = html;
            container.style.opacity = 1;
        }, 200);
    },

    // --- 2. Smart Polling Locator (Mock Civic API) ---
    findPollingPlace() {
        const address = document.getElementById('address-input').value.trim();
        const resultDiv = document.getElementById('locator-result');
        
        if (!address) {
            resultDiv.innerHTML = "<p style='color:#ff3333;'>Error: Input required.</p>";
            resultDiv.classList.remove('hidden');
            return;
        }

        resultDiv.innerHTML = "<p style='color:var(--text-secondary);'>Connecting to Civic API...</p>";
        resultDiv.classList.remove('hidden');

        setTimeout(() => {
            resultDiv.innerHTML = `
                <h4>📍 Location Resolved</h4>
                <p>Govt. Higher Secondary School, ${address}</p>
                <p style="color:var(--text-secondary); font-size:0.8rem; margin-top:8px;">Hours: 07:00 - 18:00 | Wheelchair Accessible</p>
            `;
        }, 800);
    },

    // --- 3. Secure & Persistent Voting Journey ---
    loadJourney() {
        for (let i = 1; i <= 4; i++) {
            if (localStorage.getItem('step-' + i) === 'true') {
                document.getElementById('step-' + i).classList.add('completed');
            }
        }
    },

    toggleStep(stepNum) {
        const stepEl = document.getElementById('step-' + stepNum);
        if (stepEl.classList.contains('completed')) {
            stepEl.classList.remove('completed');
            localStorage.setItem('step-' + stepNum, 'false');
        } else {
            stepEl.classList.add('completed');
            localStorage.setItem('step-' + stepNum, 'true');
        }
    },

    // --- AI Chat Logic ---
    toggleChat() {
        const chat = document.getElementById('ai-chat-overlay');
        chat.classList.toggle('hidden');
        if (!chat.classList.contains('hidden')) {
            document.getElementById('user-input').focus();
        }
    },

    handleKeyPress(event) {
        if (event.key === 'Enter') this.sendMessage();
    },

    async sendMessage() {
        const inputField = document.getElementById('user-input');
        const userText = inputField.value.trim();
        if (userText === "") return;

        const display = document.getElementById('chat-display');

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = "msg user-msg";
        userMsg.textContent = userText;
        display.appendChild(userMsg);
        
        inputField.value = "";
        display.scrollTop = display.scrollHeight;

        // Add typing indicator
        const typingId = 'typing-' + Date.now();
        const typingEl = document.createElement('div');
        typingEl.id = typingId;
        typingEl.className = "msg bot-msg";
        typingEl.textContent = "...";
        display.appendChild(typingEl);
        display.scrollTop = display.scrollHeight;

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText })
            });

            if (!response.ok) throw new Error("API Error");
            const data = await response.json();
            
            document.getElementById(typingId).remove();
            this.addBotMessage(data.response);
        } catch (error) {
            document.getElementById(typingId).remove();
            this.addBotMessage("Connection to Gemini API failed. Retrying...");
        }
    },

    addBotMessage(text) {
        const display = document.getElementById('chat-display');
        const botMsg = document.createElement('div');
        botMsg.className = "msg bot-msg";
        botMsg.innerHTML = this.escapeHTML(text).replace(/\n/g, '<br>');
        display.appendChild(botMsg);
        display.scrollTop = display.scrollHeight;
    },

    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag]));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.loadJourney();
});