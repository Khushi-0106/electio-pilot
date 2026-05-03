// state.js
export const ElectionStore = {
    steps: [
        { id: 1, label: "Register", status: "current", info: "Deadline: Oct 2026" },
        { id: 2, label: "Primaries", status: "upcoming", info: "Ongoing through Sept" },
        { id: 3, label: "General", status: "upcoming", info: "Nov 3, 2026" }
    ],
    updateStatus(stepId, newStatus) {
        const step = this.steps.find(s => s.id === stepId);
        if (step) step.status = newStatus;
        // Trigger UI Re-render here
    }
};