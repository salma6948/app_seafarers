import React, { useState, useEffect, useRef } from 'react';
import { Anchor, AlertCircle, Send } from 'lucide-react';
import Markdown from 'react-markdown';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { Message } from '../types';

interface AnchorChatProps {
    messages: Message[];
    onSendMessage: (text: string) => Promise<void>;
}

export function AnchorChat({ messages, onSendMessage }: AnchorChatProps) {
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputText.trim() || isTyping) return;

        const text = inputText;
        setInputText('');
        setIsTyping(true);

        await onSendMessage(text);
        setIsTyping(false);
    };

    return (
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
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Talk to Anchor..."
                        className="w-full bg-maritime-950 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-maritime-accent/50 transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim() || isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-maritime-accent disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
