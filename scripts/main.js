const app = {
    // Navigate to ECI Links
    nav(action) {
        const links = {
            check: "https://electoralsearch.eci.gov.in/",
            update: "https://voters.eci.gov.in/form8"
        };
        window.open(links[action], '_blank');
    },

    // AI Chat Toggle
    toggleChat() {
        const chat = document.getElementById('ai-chat-overlay');
        chat.classList.toggle('hidden');
    },

    // Dynamic 2026 Election Data
    init() {
        const now = new Date(); // April 30, 2026
        const countingDay = new Date('2026-05-04');
        const diffInDays = Math.ceil((countingDay - now) / (1000 * 60 * 60 * 24));

        const desc = document.getElementById('timeline-desc');
        if (desc) {
            desc.innerText = `All polling phases complete. ${diffInDays} days until results.`;
        }
    },

    sendMessage() {
        const input = document.getElementById('user-input');
        const display = document.getElementById('chat-display');
        if (input.value.trim() !== "") {
            const userMsg = document.createElement('div');
            userMsg.style.textAlign = 'right';
            userMsg.style.margin = '10px 0';
            userMsg.innerText = input.value;
            display.appendChild(userMsg);
            input.value = "";
            
            // Simulating AI Response
            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = "bot-msg";
                botMsg.innerText = "I'm checking the 2026 ECI guidelines for you...";
                display.appendChild(botMsg);
            }, 800);
        }
    }
    
};

document.addEventListener('DOMContentLoaded', () => app.init());