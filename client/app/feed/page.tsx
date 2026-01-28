"use client";

import FeedTimeline from '@/components/feed/FeedTimeline';

export default function FeedPage() {
    return (
        <div className="h-full flex flex-col bg-obsidian overflow-hidden">
            <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">System Pulse</h1>
                        <p className="text-zinc-400 max-w-lg mx-auto">
                            Real-time observability layer tracks knowledge integrity, version changes, and automated background tasks.
                        </p>
                    </div>

                    <FeedTimeline />
                </div>
            </main>
        </div>
    );
}
