"use client";

import { Bot } from 'lucide-react';

export default function ChatSkeleton() {
    return (
        <div className="flex gap-4 p-6 rounded-2xl bg-zinc-glass border border-zinc-800/50">
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shrink-0 text-white shadow-lg shadow-cyan-500/20">
                <Bot size={16} />
            </div>
            <div className="flex-1 space-y-3 py-1">
                <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-zinc-800 rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-zinc-800 rounded w-5/6 animate-pulse" />
            </div>
        </div>
    );
}
