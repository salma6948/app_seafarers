/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Anchor,
  Activity,
  MessageSquare,
  BookOpen,
  Users,
  Home,
  Zap,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { CheckIn, Message } from './types';
import { seamindApi } from './lib/api';

import { Dashboard } from './components/Dashboard';
import { AnchorChat } from './components/AnchorChat';
import { PulseCheckIn } from './components/PulseCheckIn';
import { HarborResources } from './components/HarborResources';
import { CrewConnect } from './components/CrewConnect';
import { BridgeHome } from './components/BridgeHome';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'anchor' | 'pulse' | 'harbor' | 'crew' | 'bridge'>('dashboard');
  const [history, setHistory] = useState<CheckIn[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pulseHistory, chatHistory] = await Promise.all([
          seamindApi.getPulseHistory(),
          seamindApi.getChatHistory()
        ]);
        setHistory(pulseHistory);
        setMessages(chatHistory);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);

    try {
      const responseMessage = await seamindApi.sendMessage(text);
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm currently offline or experiencing issues. Remember, you can always talk to your ship's medical officer or use the emergency contacts in the Harbor.", timestamp: Date.now() }]);
    }
  };

  const handlePulseSubmit = async (mood: number, stress: number, sleep: number, fatigue: number) => {
    try {
      await seamindApi.submitPulse({ mood, stress, sleep, fatigue });
      const newHistory = await seamindApi.getPulseHistory();
      setHistory(newHistory);
      setActiveTab('dashboard');
    } catch (error) {
      console.error("Failed to submit pulse:", error);
    }
  };

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
          {isLoadingData && (
            <div className="flex items-center justify-center h-64 text-maritime-accent">
              <Anchor className="w-8 h-8 animate-pulse" />
              <span className="ml-3 font-semibold tracking-wider">Loading Voyage Data...</span>
            </div>
          )}
          {!isLoadingData && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'dashboard' && <Dashboard history={history} onNavigateToPulse={() => setActiveTab('pulse')} />}
                {activeTab === 'anchor' && <AnchorChat messages={messages} onSendMessage={handleSendMessage} />}
                {activeTab === 'pulse' && <PulseCheckIn onComplete={handlePulseSubmit} onCancel={() => setActiveTab('dashboard')} />}
                {activeTab === 'harbor' && <HarborResources />}
                {activeTab === 'crew' && <CrewConnect />}
                {activeTab === 'bridge' && <BridgeHome />}
              </motion.div>
            </AnimatePresence>
          )}
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
