"use client";

import { Database, FileText, Server } from 'lucide-react';

export default function UsageStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vector Storage Card */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Database size={120} />
                </div>

                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6">Vector Storage</h3>

                <div className="flex items-center gap-6">
                    {/* Ring Chart */}
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-zinc-800"
                                fill="transparent"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-amber-400"
                                fill="transparent"
                                strokeDasharray="251.2"
                                strokeDashoffset="240" /* 4% usage roughly */
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-xl font-bold text-white">4%</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-2xl font-bold text-white">420 <span className="text-sm text-zinc-500 font-normal">/ 10,000</span></p>
                        <p className="text-sm text-zinc-500 mt-1">Embeddings Used</p>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-green-400">Pinecone Index Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Usage Card */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FileText size={120} />
                </div>

                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6">Knowledge Base</h3>

                <div className="flex items-center gap-6">
                    {/* Ring Chart */}
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-zinc-800"
                                fill="transparent"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-blue-500"
                                fill="transparent"
                                strokeDasharray="251.2"
                                strokeDashoffset="213" /* 15% usage */
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-xl font-bold text-white">15%</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-2xl font-bold text-white">15 <span className="text-sm text-zinc-500 font-normal">/ 100</span></p>
                        <p className="text-sm text-zinc-500 mt-1">Documents Uploaded</p>
                        <p className="text-xs text-zinc-600 mt-2">Next tier unlock: 500 docs</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
