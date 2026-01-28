"use client";

import clsx from 'clsx';
import { FileText, User, Bot } from 'lucide-react';

interface Citation {
    doc: string;
    version: number;
    confidence: string;
}

interface ChatBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    citations?: Citation[];
    isLoading?: boolean;
}

export default function ChatBubble({ role, content, citations, isLoading }: ChatBubbleProps) {
    if (isLoading) {
        return (
            <div className="flex gap-4 p-4 max-w-3xl animate-pulse">
                <div className="w-8 h-8 rounded-full bg-zinc-800" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-800 rounded w-1/4" />
                    <div className="h-4 bg-zinc-800 rounded w-1/2" />
                </div>
            </div>
        );
    }

    return (
        <div className={clsx(
            "flex gap-4 p-6 sm:rounded-2xl transition-all",
            role === 'user' ? "bg-transparent" : "bg-zinc-glass border border-zinc-800/50"
        )}>
            {/* Avatar */}
            <div className={clsx(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                role === 'user' ? "bg-zinc-800 text-zinc-400" : "bg-linear-to-tr from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
            )}>
                {role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2 overflow-hidden">
                <p className="font-semibold text-sm text-zinc-400 mb-1">
                    {role === 'user' ? 'You' : 'InsightOps AI'}
                </p>
                <div className="text-zinc-100 leading-relaxed whitespace-pre-wrap">
                    {content}
                </div>

                {/* Citations Footer */}
                {citations && citations.length > 0 && (
                    <div className="pt-4 mt-2 flex flex-wrap gap-2">
                        {citations.map((cite, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:border-zinc-700 transition-colors cursor-pointer group">
                                <FileText size={12} className="text-cyan-500/70 group-hover:text-cyan-400" />
                                <span>{cite.doc}</span>
                                <span className="bg-zinc-800 px-1 rounded text-[10px] text-zinc-500">v{cite.version}</span>
                                <span className="text-zinc-600">| {cite.confidence}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
