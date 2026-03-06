import React from 'react';
import { cn } from '../lib/utils';

interface PulseCheckInProps {
    onComplete: (mood: number, stress: number, sleep: number, fatigue: number) => void;
    onCancel: () => void;
}

export function PulseCheckIn({ onComplete, onCancel }: PulseCheckInProps) {
    return (
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

                <div className="space-y-3">
                    <button
                        onClick={() => onComplete(4, 2, 4, 3)}
                        className="w-full py-4 bg-maritime-accent text-maritime-950 font-bold rounded-2xl hover:bg-maritime-accent/90 transition-all shadow-xl shadow-maritime-accent/10"
                    >
                        Complete Check-in
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full py-4 bg-transparent text-maritime-muted font-bold rounded-2xl border border-white/10 hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
