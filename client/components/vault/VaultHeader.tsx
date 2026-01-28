"use client";

import { Search, Filter, Database, AlertTriangle, CheckCircle } from 'lucide-react';

interface VaultHeaderProps {
    totalDocs: number;
    activeDocs: number;
}

export default function VaultHeader({ totalDocs, activeDocs }: VaultHeaderProps) {
    return (
        <div className="space-y-6 mb-8">
            {/* Title & Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Knowledge Vault</h1>
                    <p className="text-zinc-400">Manage, audit, and track the lifecycle of your workspace documents.</p>
                </div>

                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle size={14} className="text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-400">{activeDocs} Active</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <AlertTriangle size={14} className="text-amber-500" />
                        <span className="text-sm font-medium text-amber-500">{totalDocs - activeDocs} Inactive</span>
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by filename..."
                        className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-zinc-600"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-all">
                    <Filter size={18} />
                    <span>Filter</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-black font-bold rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20">
                    <Database size={18} />
                    <span>Upload New</span>
                </button>
            </div>
        </div>
    );
}
