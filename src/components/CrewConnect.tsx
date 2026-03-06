import React from 'react';
import { Users } from 'lucide-react';
import { cn } from '../lib/utils';

export function CrewConnect() {
    return (
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
}
