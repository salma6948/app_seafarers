export interface CheckIn {
  id: string;
  date: string;
  mood: number; // 1-5
  sleep: number; // 1-5
  stress: number; // 1-5
  fatigue: number; // 1-5
  notes?: string;
}

export interface Resource {
  id: string;
  title: string;
  category: 'CBT' | 'Mindfulness' | 'Sleep' | 'Exercise';
  duration: string;
  description: string;
  type: 'audio' | 'text' | 'video';
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
