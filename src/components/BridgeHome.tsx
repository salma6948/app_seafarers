import React from 'react';
import { Home, Sun } from 'lucide-react';

export function BridgeHome() {
    return (
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
}
