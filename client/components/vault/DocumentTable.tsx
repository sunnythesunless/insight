"use client";

import { FileText, MoreVertical, RefreshCw, Clock, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Document {
    id: string;
    title: string;
    status: string;
    version: string;
    added: string;
    confidence: string;
    summary?: string;
    uploadedBy?: string;
    expires?: string;
}

interface DocumentTableProps {
    documents: Document[];
    onRefresh: (id: string) => void;
}

export default function DocumentTable({ documents, onRefresh }: DocumentTableProps) {
    const [selectedDoc, setSelectedDoc] = useState<any>(null);

    return (
        <div className="relative">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
                <table className="w-full text-left">
                    <thead className="bg-zinc-900/80 border-b border-zinc-800 text-xs uppercase text-zinc-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Document Name</th>
                            <th className="px-6 py-4">Version</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Uploaded</th>
                            <th className="px-6 py-4">Expiration</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {documents.map((doc) => (
                            <tr
                                key={doc.id}
                                onClick={() => setSelectedDoc(doc)}
                                className="group hover:bg-zinc-800/50 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-amber-400 group-hover:bg-amber-400/10 transition-colors">
                                            <FileText size={18} />
                                        </div>
                                        <span className="font-medium text-zinc-200 group-hover:text-white transition-colors">{doc.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-zinc-400 font-mono text-sm">{doc.version}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={doc.status} />
                                </td>
                                <td className="px-6 py-4 text-zinc-400 text-sm">{doc.added}</td>
                                <td className="px-6 py-4 text-zinc-400 text-sm">{doc.expires}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-700 transition-colors">
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 active:bg-zinc-800 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white text-sm">{doc.title}</h3>
                                    <p className="text-xs text-zinc-500">{doc.added}</p>
                                </div>
                            </div>
                            <StatusBadge status={doc.status} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 pl-11">
                            <span>Ver: {doc.version}</span>
                            <span className="flex items-center gap-1">expires: {doc.expires}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slide-over Panel (Detail View) */}
            <AnimatePresence>
                {selectedDoc && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedDoc(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-zinc-900 border-l border-zinc-800 shadow-2xl z-50 p-6 overflow-y-auto"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-1">Document Intelligence</h2>
                                    <p className="text-sm text-zinc-500">AI-Generated Analysis</p>
                                </div>
                                <button
                                    onClick={() => setSelectedDoc(null)}
                                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">File Details</h3>
                                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-zinc-400">Name</span>
                                            <span className="text-sm text-white font-medium text-right truncate pl-4">{selectedDoc.title}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-zinc-400">Version</span>
                                            <span className="text-sm text-mono text-amber-400">{selectedDoc.version}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-zinc-400">Uploaded By</span>
                                            <span className="text-sm text-white">{selectedDoc.uploadedBy}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-zinc-400">Status</span>
                                            <StatusBadge status={selectedDoc.status} />
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">AI Change Summary</h3>
                                    <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                                        <p className="text-sm text-zinc-300 leading-relaxed">
                                            {selectedDoc.summary}
                                        </p>
                                    </div>
                                </section>

                                {selectedDoc.status === 'decayed' && (
                                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20">
                                        <RefreshCw size={18} />
                                        Update Document
                                    </button>
                                )}

                                <section>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Version Timeline</h3>
                                    <div className="space-y-4 pl-2 border-l border-zinc-800 ml-1">
                                        <div className="pl-4 relative">
                                            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                            <p className="text-sm text-white font-medium">Current Version ({selectedDoc.version})</p>
                                            <p className="text-xs text-zinc-500">Uploaded {selectedDoc.added}</p>
                                        </div>
                                        {selectedDoc.version !== 'v1.0' && (
                                            <div className="pl-4 relative opacity-50">
                                                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-700" />
                                                <p className="text-sm text-zinc-300 font-medium">Previous Version (v1.0)</p>
                                                <p className="text-xs text-zinc-500">Uploaded 3 months ago</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'active') {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                Active
            </span>
        );
    }
    if (status === 'decayed') {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/10">
                Decayed
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
            Archived
        </span>
    );
}
