const app = {
    // Backend URL. Uses relative path to work seamlessly on Railway.
    apiUrl: '/api/chat',
    
    // --- 1. Personalized Timelines ---
    updateTimeline() {
        const state = document.getElementById('state-selector').value;
        const container = document.getElementById('timeline-container');
        const desc = document.getElementById('timeline-desc');
        
        let html = '';
        if (state === 'national') {
            desc.innerText = "Tracking the 2026 Lok Sabha Phases.";
            html = `
                <div class="item done"><span>Apr 09</span> Phase 1</div>
                <div class="item done"><span>Apr 23</span> Phase 2</div>
                <div class="item active"><span>May 04</span> Counting</div>
            `;
        } else if (state === 'karnataka') {
            desc.innerText = "Karnataka Election Schedule.";
            html = `
                <div class="item done"><span>Apr 09</span> Voting Day</div>
                <div class="item active"><span>May 04</span> Results</div>
            `;
        } else if (state === 'tamil_nadu') {
            desc.innerText = "Tamil Nadu Election Schedule.";
            html = `
                <div class="item done"><span>Apr 23</span> Voting Day</div>
                <div class="item active"><span>May 04</span> Results</div>
            `;
        } else if (state === 'maharashtra') {
            desc.innerText = "Maharashtra Election Schedule.";
            html = `
                <div class="item done"><span>Apr 09</span> Phase 1</div>
                <div class="item done"><span>Apr 23</span> Phase 2</div>
                <div class="item active"><span>May 04</span> Results</div>
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
            resultDiv.innerHTML = "<p style='color:#ef4444;'>Please enter a valid Zip Code or City.</p>";
            resultDiv.classList.remove('hidden');
            return;
        }

        resultDiv.innerHTML = "<p>Searching Google Civic API...</p>";
        resultDiv.classList.remove('hidden');

        // Simulate API latency
        setTimeout(() => {
            resultDiv.innerHTML = `
                <h4>📍 Polling Location Found</h4>
                <p><strong>Location:</strong> Government Primary School, ${address}</p>
                <p><strong>Hours:</strong> 7:00 AM - 6:00 PM</p>
                <p><strong>Accessibility:</strong> Wheelchair Accessible</p>
            `;
        }, 1200);
    },

    // --- 3. Secure & Persistent Voting Journey ---
    loadJourney() {
        for (let i = 1; i <= 4; i++) {
            const isCompleted = localStorage.getItem('step-' + i) === 'true';
            if (isCompleted) {
                document.getElementById('step-' + i).classList.add('completed');
            }
        }
    },

    toggleStep(stepNum) {
        const stepEl = document.getElementById('step-' + stepNum);
        const isCurrentlyCompleted = stepEl.classList.contains('completed');
        
        if (isCurrentlyCompleted) {
            stepEl.classList.remove('completed');
            localStorage.setItem('step-' + stepNum, 'false');
        } else {
            stepEl.classList.add('completed');
            localStorage.setItem('step-' + stepNum, 'true');
        }

        // Show quick "Saved" flash
        const saveStatus = document.getElementById('save-status');
        saveStatus.style.opacity = 1;
        setTimeout(() => saveStatus.style.opacity = 0.5, 1500);
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
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    },

    async sendMessage() {
        const inputField = document.getElementById('user-input');
        const userText = inputField.value.trim();
        if (userText === "") return;

        const display = document.getElementById('chat-display');

        const userMsg = document.createElement('div');
        userMsg.className = "message user-msg";
        userMsg.innerHTML = `<div class="msg-content">${this.escapeHTML(userText)}</div>`;
        display.appendChild(userMsg);
        
        inputField.value = "";
        this.scrollToBottom();

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
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText })
            });

            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            
            document.getElementById(typingId).remove();
            this.addBotMessage(data.response);
        } catch (error) {
            console.error("Error communicating with AI backend:", error);
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();
            this.addBotMessage("I'm currently offline or unable to reach the election servers. Please try again later or visit eci.gov.in directly.");
        }
    },

    addBotMessage(text) {
        const display = document.getElementById('chat-display');
        const botMsg = document.createElement('div');
        botMsg.className = "message bot-msg";
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

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    app.loadJourney();
    // Enable transition on timeline container
    document.getElementById('timeline-container').style.transition = 'opacity 0.2s ease-in-out';
});