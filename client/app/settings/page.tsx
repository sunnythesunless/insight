"use client";

import { Copy, RefreshCw, AlertTriangle, Building2, Terminal } from 'lucide-react';
import MemberList from '@/components/settings/MemberList';
import UsageStats from '@/components/settings/UsageStats';
import { useState } from 'react';
import clsx from 'clsx';

export default function SettingsPage() {
    const [inviteCode, setInviteCode] = useState('INSIGHT-X9J');
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleRegenerate = () => {
        setInviteCode('INSIGHT-' + Math.random().toString(36).substring(2, 5).toUpperCase());
    };

    return (
        <div className="h-full flex flex-col bg-obsidian overflow-hidden">
            <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Workspace HQ</h1>
                            <p className="text-zinc-400">Administrative control center for Engineering Alpha.</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-500">
                            <Terminal size={14} />
                            <span>ID: 65b2a0c4...e6f</span>
                        </div>
                    </div>

                    {/* Identity & Invite Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Workspace Name Card */}
                        <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-amber-400 flex items-center justify-center text-2xl font-bold text-black shadow-lg shadow-amber-400/20">
                                        E
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Engineering Alpha</h2>
                                        <p className="text-sm text-zinc-500">Free Tier Plan</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white border border-zinc-700 hover:bg-zinc-800 rounded-xl transition-colors">
                                    Edit Details
                                </button>
                            </div>
                        </div>

                        {/* Invite Code Card */}
                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Invite Team Code</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex-1 bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-center font-mono text-lg font-bold text-amber-400 tracking-wider">
                                    {inviteCode}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors relative"
                                    title="Copy"
                                >
                                    <Copy size={18} />
                                    {isCopied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded">Copied!</span>}
                                </button>
                            </div>
                            <button
                                onClick={handleRegenerate}
                                className="w-full flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                <RefreshCw size={12} />
                                Regenerate Code
                            </button>
                        </div>
                    </div>

                    {/* Infrastructure Health */}
                    <UsageStats />

                    {/* Team Management */}
                    <MemberList />

                    {/* Danger Zone */}
                    <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-500/10 rounded-xl text-red-500 mt-1">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Delete Workspace</h3>
                                <p className="text-sm text-zinc-400 max-w-md">
                                    Permanently delete this workspace and all 15 documents. This action cannot be undone and will terminate all active API keys.
                                </p>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold border border-red-500/50 rounded-xl transition-colors whitespace-nowrap">
                            Delete Workspace
                        </button>
                    </div>

                    <div className="h-12" /> {/* Bottom spacer */}
                </div>
            </main>
        </div>
    );
}
