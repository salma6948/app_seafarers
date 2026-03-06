/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Anchor, 
  Activity, 
  MessageSquare, 
  BookOpen, 
  Users, 
  Home, 
  Send, 
  Plus, 
  Moon, 
  Sun, 
  Wind, 
  AlertCircle,
  ChevronRight,
  Heart,
  Brain,
  Zap,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { format } from 'date-fns';
import { cn } from './lib/utils';
import { CheckIn, Message, Resource } from './types';
import { MOCK_HISTORY, MOCK_RESOURCES } from './constants';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'anchor' | 'pulse' | 'harbor' | 'crew' | 'bridge'>('dashboard');
  const [history, setHistory] = useState<CheckIn[]>(MOCK_HISTORY);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello, I'm Anchor. I'm here to support you during your voyage. How are you feeling today?", timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = { role: 'user', text: inputText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.concat(userMessage).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: "You are 'Anchor', an AI companion for seafarers. You are empathetic, maritime-aware (understand watch schedules, isolation, rough seas), and focused on mental well-being. You are a bridge to human help, not a replacement. If you detect severe distress or self-harm intent, provide immediate crisis resources (ISWAN, SeafarerHelp) and encourage contacting the ship's medical officer. Keep responses concise and supportive.",
        }
      });

      const modelText = response.text || "I'm sorry, I'm having trouble connecting. Please try again or reach out to a crew mate.";
      setMessages(prev => [...prev, { role: 'model', text: modelText, timestamp: Date.now() }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm currently offline or experiencing issues. Remember, you can always talk to your ship's medical officer or use the emergency contacts in the Harbor.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Voyage Status</h1>
          <p className="text-maritime-muted">Day 42 of current contract</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-maritime-accent/10 border border-maritime-accent/20 rounded-full text-maritime-accent text-sm">
          <div className="w-2 h-2 bg-maritime-accent rounded-full animate-pulse" />
          Offline-Ready
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="text-maritime-muted text-sm uppercase tracking-wider font-semibold">Mood Score</span>
            <Heart className="text-pink-500 w-5 h-5" />
          </div>
          <div className="text-4xl font-bold text-white">4.2<span className="text-lg text-maritime-muted font-normal">/5</span></div>
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            <ChevronRight className="w-3 h-3 rotate-[-90deg]" /> +12% from last week
          </div>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="text-maritime-muted text-sm uppercase tracking-wider font-semibold">Stress Level</span>
            <Brain className="text-purple-500 w-5 h-5" />
          </div>
          <div className="text-4xl font-bold text-white">2.1<span className="text-lg text-maritime-muted font-normal">/5</span></div>
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            <ChevronRight className="w-3 h-3 rotate-[90deg]" /> -5% from last week
          </div>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="text-maritime-muted text-sm uppercase tracking-wider font-semibold">Sleep Quality</span>
            <Moon className="text-blue-400 w-5 h-5" />
          </div>
          <div className="text-4xl font-bold text-white">3.8<span className="text-lg text-maritime-muted font-normal">/5</span></div>
          <div className="text-xs text-amber-400 flex items-center gap-1">
            No change from last week
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 h-[300px]">
        <h3 className="text-lg font-semibold mb-4 text-white">Well-being Trends</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64ffda" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#64ffda" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#233554" vertical={false} />
            <XAxis dataKey="date" stroke="#8892b0" fontSize={12} tickFormatter={(str) => str.split('-')[2]} />
            <YAxis stroke="#8892b0" fontSize={12} domain={[0, 5]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#112240', border: '1px solid #233554', borderRadius: '8px' }}
              itemStyle={{ color: '#64ffda' }}
            />
            <Area type="monotone" dataKey="mood" stroke="#64ffda" fillOpacity={1} fill="url(#colorMood)" strokeWidth={2} />
            <Area type="monotone" dataKey="stress" stroke="#a855f7" fill="transparent" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Anchor className="w-5 h-5 text-maritime-accent" />
            Anchor's Insight
          </h3>
          <p className="text-maritime-text text-sm leading-relaxed">
            "Your mood has been steadily improving over the last 3 days. However, your sleep quality dipped slightly during the last rough weather patch. Consider using the 'Engine Room Wind-down' audio tonight."
          </p>
        </div>
        <div className="glass-panel p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            Action Required
          </h3>
          <button 
            onClick={() => setActiveTab('pulse')}
            className="w-full py-3 bg-maritime-accent text-maritime-950 font-bold rounded-xl hover:bg-maritime-accent/90 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Daily Check-in
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnchor = () => (
    <div className="flex flex-col h-[calc(100vh-120px)] glass-panel overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-maritime-900/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-maritime-accent/20 flex items-center justify-center">
            <Anchor className="text-maritime-accent w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-white">Anchor</h2>
            <span className="text-xs text-maritime-accent">Always Listening</span>
          </div>
        </div>
        <button className="p-2 text-maritime-muted hover:text-white transition-colors">
          <AlertCircle className="w-5 h-5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl text-sm",
              m.role === 'user' 
                ? "bg-maritime-accent text-maritime-950 rounded-tr-none" 
                : "bg-maritime-800 text-maritime-text rounded-tl-none border border-white/5"
            )}>
              <Markdown>{m.text}</Markdown>
              <div className={cn("text-[10px] mt-2 opacity-50", m.role === 'user' ? "text-maritime-950" : "text-maritime-muted")}>
                {format(m.timestamp, 'HH:mm')}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-maritime-800 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
              <div className="w-1.5 h-1.5 bg-maritime-accent rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-maritime-accent rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-maritime-accent rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-maritime-900/80 border-t border-white/10">
        <div className="relative">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Talk to Anchor..."
            className="w-full bg-maritime-950 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-maritime-accent/50 transition-colors"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-maritime-accent disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderHarbor = () => (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Harbor Resources</h1>
        <p className="text-maritime-muted">Offline-accessible mental health library</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['All', 'CBT', 'Mindfulness', 'Sleep', 'Exercise'].map(cat => (
          <button key={cat} className="px-4 py-2 rounded-full bg-maritime-800 text-sm whitespace-nowrap border border-white/5 hover:border-maritime-accent/30 transition-colors">
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_RESOURCES.map(res => (
          <div key={res.id} className="glass-panel p-5 hover:border-maritime-accent/30 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className={cn(
                "p-2 rounded-lg",
                res.category === 'Mindfulness' ? "bg-emerald-500/10 text-emerald-400" :
                res.category === 'CBT' ? "bg-purple-500/10 text-purple-400" :
                "bg-blue-500/10 text-blue-400"
              )}>
                {res.category === 'Mindfulness' ? <Wind className="w-5 h-5" /> :
                 res.category === 'CBT' ? <Brain className="w-5 h-5" /> :
                 <Moon className="w-5 h-5" />}
              </div>
              <span className="text-xs text-maritime-muted flex items-center gap-1">
                <Clock className="w-3 h-3" /> {res.duration}
              </span>
            </div>
            <h3 className="font-bold text-white mb-2 group-hover:text-maritime-accent transition-colors">{res.title}</h3>
            <p className="text-sm text-maritime-muted line-clamp-2 mb-4">{res.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-maritime-accent/50">{res.type}</span>
              <ChevronRight className="w-4 h-4 text-maritime-muted group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 border-amber-500/20 bg-amber-500/5">
        <h3 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Emergency Contacts
        </h3>
        <p className="text-sm text-maritime-text mb-4">If you are in immediate danger or need urgent help, contact these services 24/7.</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-maritime-950 rounded-lg border border-white/5">
            <div>
              <div className="font-bold text-white">SeafarerHelp (ISWAN)</div>
              <div className="text-xs text-maritime-muted">Global 24/7 Helpline</div>
            </div>
            <button className="px-4 py-2 bg-maritime-accent text-maritime-950 text-xs font-bold rounded-lg">CALL</button>
          </div>
          <div className="flex justify-between items-center p-3 bg-maritime-950 rounded-lg border border-white/5">
            <div>
              <div className="font-bold text-white">Ship Medical Officer</div>
              <div className="text-xs text-maritime-muted">Internal Bridge Contact</div>
            </div>
            <button className="px-4 py-2 bg-maritime-accent text-maritime-950 text-xs font-bold rounded-lg">PAGE</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPulse = () => (
    <div className="max-w-md mx-auto space-y-8 py-4">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-white">Daily Pulse</h1>
        <p className="text-maritime-muted">How are you holding up today?</p>
      </header>

      <div className="space-y-10">
        <section>
          <h3 className="text-center text-maritime-muted text-sm uppercase tracking-widest mb-6">Current Mood</h3>
          <div className="flex justify-between items-center px-4">
            {[1, 2, 3, 4, 5].map(val => (
              <button 
                key={val}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all",
                  val === 4 ? "bg-maritime-accent text-maritime-950 scale-110 shadow-lg shadow-maritime-accent/20" : "bg-maritime-800 text-maritime-muted hover:bg-maritime-700"
                )}
              >
                {val === 1 ? '😞' : val === 2 ? '😟' : val === 3 ? '😐' : val === 4 ? '🙂' : '😊'}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-maritime-muted uppercase tracking-wider">
              <span>Stress Level</span>
              <span className="text-maritime-accent">Low</span>
            </div>
            <div className="h-2 bg-maritime-800 rounded-full overflow-hidden">
              <div className="h-full bg-maritime-accent w-1/4" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-maritime-muted uppercase tracking-wider">
              <span>Sleep Quality</span>
              <span className="text-maritime-accent">Good</span>
            </div>
            <div className="h-2 bg-maritime-800 rounded-full overflow-hidden">
              <div className="h-full bg-maritime-accent w-3/4" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-maritime-muted uppercase tracking-wider">
              <span>Fatigue</span>
              <span className="text-maritime-accent">Moderate</span>
            </div>
            <div className="h-2 bg-maritime-800 rounded-full overflow-hidden">
              <div className="h-full bg-maritime-accent w-1/2" />
            </div>
          </div>
        </section>

        <button 
          onClick={() => setActiveTab('dashboard')}
          className="w-full py-4 bg-maritime-accent text-maritime-950 font-bold rounded-2xl hover:bg-maritime-accent/90 transition-all shadow-xl shadow-maritime-accent/10"
        >
          Complete Check-in
        </button>
      </div>
    </div>
  );

  const renderCrew = () => (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Crew Connect</h1>
        <p className="text-maritime-muted">Anonymous peer support for seafarers</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <div className="glass-panel p-6 border-maritime-accent/20 bg-maritime-accent/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-maritime-accent/20 flex items-center justify-center">
              <Users className="text-maritime-accent w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white">Active Discussion Rooms</h3>
              <p className="text-xs text-maritime-muted">AI-moderated safe spaces</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { name: 'First Contract Anxiety', users: 12, active: true },
              { name: 'Away from Newborns', users: 8, active: true },
              { name: 'Dealing with Rough Weather', users: 24, active: true },
              { name: 'Life After Sea', users: 5, active: false },
            ].map(room => (
              <div key={room.name} className="flex justify-between items-center p-4 bg-maritime-950 rounded-xl border border-white/5 hover:border-maritime-accent/30 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", room.active ? "bg-emerald-400 animate-pulse" : "bg-maritime-muted")} />
                  <span className="font-semibold text-sm group-hover:text-maritime-accent transition-colors">{room.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-maritime-muted">
                  <Users className="w-3 h-3" /> {room.users}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-bold text-white mb-4">Anonymous Matching</h3>
          <p className="text-sm text-maritime-muted mb-6">Connect 1-on-1 with a seafarer of similar rank or route for a private chat.</p>
          <button className="w-full py-3 border border-maritime-accent text-maritime-accent font-bold rounded-xl hover:bg-maritime-accent/10 transition-colors">
            Find a Peer Match
          </button>
        </div>
      </div>
    </div>
  );

  const renderBridge = () => (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Bridge Home</h1>
        <p className="text-maritime-muted">Stay connected with your loved ones</p>
      </header>

      <div className="glass-panel p-6 flex flex-col items-center text-center py-12">
        <div className="w-20 h-20 rounded-full bg-maritime-800 flex items-center justify-center mb-6">
          <Home className="text-maritime-accent w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Async Video Messaging</h3>
        <p className="text-maritime-muted max-w-xs mb-8">Record messages now, they'll sync automatically next time the ship reaches port or satellite signal improves.</p>
        <button className="px-8 py-3 bg-maritime-accent text-maritime-950 font-bold rounded-xl hover:bg-maritime-accent/90 transition-colors">
          Record New Message
        </button>
      </div>

      <div className="glass-panel p-6">
        <h3 className="font-bold text-white mb-4">Emotional Weather Report</h3>
        <p className="text-sm text-maritime-muted mb-4">Share a simplified summary of your well-being trends with your family to help them support you better.</p>
        <div className="p-4 bg-maritime-950 rounded-xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Sun className="text-emerald-400 w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Share Summary</div>
              <div className="text-xs text-maritime-muted">Last shared: 2 days ago</div>
            </div>
          </div>
          <button className="text-maritime-accent text-sm font-bold">Send Update</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-maritime-950">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-maritime-900 border-r border-white/10 p-4 gap-2">
        <div className="flex items-center gap-3 px-4 py-6 mb-4">
          <div className="w-10 h-10 rounded-xl bg-maritime-accent flex items-center justify-center shadow-lg shadow-maritime-accent/20">
            <Anchor className="text-maritime-950 w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">SEAMIND AI</span>
        </div>
        
        <button onClick={() => setActiveTab('dashboard')} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all", activeTab === 'dashboard' ? "nav-item-active" : "text-maritime-muted hover:text-white hover:bg-white/5")}>
          <Activity className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </button>
        <button onClick={() => setActiveTab('anchor')} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all", activeTab === 'anchor' ? "nav-item-active" : "text-maritime-muted hover:text-white hover:bg-white/5")}>
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium">Anchor AI</span>
        </button>
        <button onClick={() => setActiveTab('pulse')} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all", activeTab === 'pulse' ? "nav-item-active" : "text-maritime-muted hover:text-white hover:bg-white/5")}>
          <Zap className="w-5 h-5" />
          <span className="font-medium">Daily Pulse</span>
        </button>
        <button onClick={() => setActiveTab('harbor')} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all", activeTab === 'harbor' ? "nav-item-active" : "text-maritime-muted hover:text-white hover:bg-white/5")}>
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">Harbor</span>
        </button>
        <button onClick={() => setActiveTab('crew')} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all", activeTab === 'crew' ? "nav-item-active" : "text-maritime-muted hover:text-white hover:bg-white/5")}>
          <Users className="w-5 h-5" />
          <span className="font-medium">Crew Connect</span>
        </button>
        <button onClick={() => setActiveTab('bridge')} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all", activeTab === 'bridge' ? "nav-item-active" : "text-maritime-muted hover:text-white hover:bg-white/5")}>
          <Home className="w-5 h-5" />
          <span className="font-medium">Bridge Home</span>
        </button>

        <div className="mt-auto p-4 glass-panel border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Crisis Help</span>
          </div>
          <p className="text-[10px] text-maritime-muted mb-3">Feeling overwhelmed? Help is available 24/7.</p>
          <button className="w-full py-2 bg-amber-500 text-maritime-950 text-[10px] font-bold rounded-lg uppercase tracking-widest">Get Help Now</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'anchor' && renderAnchor()}
              {activeTab === 'pulse' && renderPulse()}
              {activeTab === 'harbor' && renderHarbor()}
              {activeTab === 'crew' && renderCrew()}
              {activeTab === 'bridge' && renderBridge()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-maritime-900/90 backdrop-blur-lg border-t border-white/10 flex justify-around items-center p-3 z-50">
        <button onClick={() => setActiveTab('dashboard')} className={cn("p-2 rounded-xl", activeTab === 'dashboard' ? "text-maritime-accent bg-maritime-accent/10" : "text-maritime-muted")}>
          <Activity className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('anchor')} className={cn("p-2 rounded-xl", activeTab === 'anchor' ? "text-maritime-accent bg-maritime-accent/10" : "text-maritime-muted")}>
          <MessageSquare className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('pulse')} className={cn("p-2 rounded-xl", activeTab === 'pulse' ? "text-maritime-accent bg-maritime-accent/10" : "text-maritime-muted")}>
          <Zap className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('harbor')} className={cn("p-2 rounded-xl", activeTab === 'harbor' ? "text-maritime-accent bg-maritime-accent/10" : "text-maritime-muted")}>
          <BookOpen className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('crew')} className={cn("p-2 rounded-xl", activeTab === 'crew' ? "text-maritime-accent bg-maritime-accent/10" : "text-maritime-muted")}>
          <Users className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}
