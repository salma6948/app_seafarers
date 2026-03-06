import { CheckIn, Message } from '../types';

export const seamindApi = {
    async getHealth() {
        const res = await fetch('/api/health');
        return res.json();
    },

    async getPulseHistory(): Promise<CheckIn[]> {
        const res = await fetch('/api/history');
        if (!res.ok) throw new Error('Failed to fetch pulse history');
        return res.json();
    },

    async submitPulse(pulseData: Omit<CheckIn, 'id' | 'date' | 'timestamp'>) {
        const res = await fetch('/api/pulse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pulseData)
        });
        if (!res.ok) throw new Error('Failed to submit pulse');
        return res.json();
    },

    async getChatHistory(): Promise<Message[]> {
        const res = await fetch('/api/chat/history');
        if (!res.ok) throw new Error('Failed to fetch chat history');
        return res.json();
    },

    async sendMessage(text: string): Promise<Message> {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to send message');
        }
        const data = await res.json();
        return data.message;
    }
};
