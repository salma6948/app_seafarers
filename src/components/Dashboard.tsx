import React from 'react';
import { Heart, Brain, Moon, ChevronRight, Anchor, AlertCircle, Plus } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { CheckIn } from '../types';

interface DashboardProps {
    history: CheckIn[];
    onNavigateToPulse: () => void;
}

export function Dashboard({ history, onNavigateToPulse }: DashboardProps) {
    return (
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
                                <stop offset="5%" stopColor="#64ffda" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#64ffda" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#233554" vertical={false} />
                        <XAxis dataKey="date" stroke="#8892b0" fontSize={12} tickFormatter={(str) => str?.split('-')[2] || ''} />
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
                        onClick={onNavigateToPulse}
                        className="w-full py-3 bg-maritime-accent text-maritime-950 font-bold rounded-xl hover:bg-maritime-accent/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Daily Check-in
                    </button>
                </div>
            </div>
        </div>
    );
}
