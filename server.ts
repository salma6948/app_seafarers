import express from 'express';
import Database from 'better-sqlite3';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Initialize Database
const db = new Database('seamind.db', { verbose: console.log });

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS pulses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    mood INTEGER NOT NULL,
    stress INTEGER NOT NULL,
    sleep INTEGER NOT NULL,
    fatigue INTEGER NOT NULL,
    timestamp INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  );
`);

// Insert initial message if empty
const msgCount = db.prepare('SELECT COUNT(*) as count FROM messages').get() as { count: number };
if (msgCount.count === 0) {
  db.prepare('INSERT INTO messages (role, text, timestamp) VALUES (?, ?, ?)').run(
    'model', 
    "Hello, I'm Anchor. I'm here to support you during your voyage. How are you feeling today?", 
    Date.now()
  );
}

// Insert mock history if empty
const pulseCount = db.prepare('SELECT COUNT(*) as count FROM pulses').get() as { count: number };
if (pulseCount.count === 0) {
  const mockHistory = [
    { date: '2023-10-01', mood: 3, stress: 4, sleep: 2, fatigue: 4, timestamp: Date.now() - 86400000 * 6 },
    { date: '2023-10-02', mood: 3, stress: 3, sleep: 3, fatigue: 3, timestamp: Date.now() - 86400000 * 5 },
    { date: '2023-10-03', mood: 4, stress: 2, sleep: 4, fatigue: 2, timestamp: Date.now() - 86400000 * 4 },
    { date: '2023-10-04', mood: 4, stress: 2, sleep: 3, fatigue: 3, timestamp: Date.now() - 86400000 * 3 },
    { date: '2023-10-05', mood: 5, stress: 1, sleep: 4, fatigue: 2, timestamp: Date.now() - 86400000 * 2 },
    { date: '2023-10-06', mood: 4, stress: 2, sleep: 4, fatigue: 2, timestamp: Date.now() - 86400000 * 1 },
    { date: '2023-10-07', mood: 4, stress: 2, sleep: 3, fatigue: 3, timestamp: Date.now() } // Represents "today" in the mock data
  ];
  
  const insertPulse = db.prepare('INSERT INTO pulses (date, mood, stress, sleep, fatigue, timestamp) VALUES (?, ?, ?, ?, ?, ?)');
  
  db.transaction(() => {
    for (const p of mockHistory) {
      insertPulse.run(p.date, p.mood, p.stress, p.sleep, p.fatigue, p.timestamp);
    }
  })();
}

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY is not set in environment variables. Anchor chat will fail.");
}
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Seamind Backend is running' });
});

// Pulse / History Endpoints
app.get('/api/history', (req, res) => {
  try {
    const history = db.prepare('SELECT * FROM pulses ORDER BY timestamp ASC').all();
    res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: 'Failed to fetch pulse history' });
  }
});

app.post('/api/pulse', (req, res) => {
  try {
    const { mood, stress, sleep, fatigue } = req.body;
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    
    // Check if pulse already exists for today, update if so, else insert.
    // For simplicity, we just insert a new record.
    const stmt = db.prepare('INSERT INTO pulses (date, mood, stress, sleep, fatigue, timestamp) VALUES (?, ?, ?, ?, ?, ?)');
    const info = stmt.run(date, mood, stress, sleep, fatigue, timestamp);
    
    res.json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error("Error saving pulse:", error);
    res.status(500).json({ error: 'Failed to save pulse' });
  }
});

// Chat Endpoints
app.get('/api/chat/history', (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY timestamp ASC').all();
    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const userTimestamp = Date.now();
  
  try {
    // 1. Save user message to database
    db.prepare('INSERT INTO messages (role, text, timestamp) VALUES (?, ?, ?)').run('user', text, userTimestamp);
    
    // 2. Fetch recent conversation history for context
    const recentMessages = db.prepare(`
      SELECT role, text FROM messages 
      ORDER BY timestamp ASC
    `).all() as {role: string, text: string}[];

    // 3. Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: recentMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })),
      config: {
        systemInstruction: "You are 'Anchor', an AI companion for seafarers. You are empathetic, maritime-aware (understand watch schedules, isolation, rough seas), and focused on mental well-being. You are a bridge to human help, not a replacement. If you detect severe distress or self-harm intent, provide immediate crisis resources (ISWAN, SeafarerHelp) and encourage contacting the ship's medical officer. Keep responses concise and supportive.",
      }
    });

    const modelText = response.text || "I'm sorry, I encountered an error formulating my response.";
    const modelTimestamp = Date.now();

    // 4. Save model response to database
    const info = db.prepare('INSERT INTO messages (role, text, timestamp) VALUES (?, ?, ?)').run('model', modelText, modelTimestamp);

    res.json({
      success: true,
      message: {
        id: info.lastInsertRowid,
        role: 'model',
        text: modelText,
        timestamp: modelTimestamp
      }
    });

  } catch (error) {
    console.error("Error processing chat message:", error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.listen(port, () => {
  console.log(`⚓ Seamind Backend API listening at http://localhost:${port}`);
});
