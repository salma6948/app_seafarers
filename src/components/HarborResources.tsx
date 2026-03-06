import React from 'react';
import { Wind, Brain, Moon, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_RESOURCES } from '../constants';

export function HarborResources() {
    return (
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
}
