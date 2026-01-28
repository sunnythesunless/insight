"use client";

import { useEffect, useState } from 'react';
import { FileText, Clock, AlertTriangle, CheckCircle, UploadCloud, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface DocLog {
    _id: string;
    docName: string;
    version: number;
    status: string;
    uploadedAt: string;
    changeSummary?: string;
}

export default function AuditPage() {
    const [logs, setLogs] = useState<DocLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const { data } = await api.get('/intelligence/documents?workspaceId=65b2a0c45f4d1a2b3c4d5e6f');
                setLogs(data);
            } catch (err) {
                console.error('Failed to load logs', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDocs();
    }, []);

    if (isLoading) {
        return (
            <div className="p-10 text-zinc-400 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-amber-400" size={32} />
                    <div className="text-sm">Loading Audit Log...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto h-full flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Audit Log</h1>
                <p className="text-zinc-400">Track document versions, knowledge integrity, and AI change summaries.</p>
            </div>

            {logs.length === 0 ? (
                // Empty State
                <div className="flex-1 flex flex-col items-center justify-center p-12 border border-zinc-800 border-dashed rounded-2xl bg-zinc-900/30">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Your Knowledge Base is Empty</h3>
                    <p className="text-zinc-400 text-center max-w-md mb-6">
                        No documents have been uploaded yet. Upload your first PDF to start the AI engine.
                    </p>
                    <button className="flex items-center gap-2 px-6 py-3 bg-amber-400 text-black rounded-lg font-bold hover:bg-amber-300 transition-colors">
                        <UploadCloud size={20} />
                        Upload First Doc
                    </button>
                </div>
            ) : (
                <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900">
                                    <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Document</th>
                                    <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Version</th>
                                    <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Change Summary</th>
                                    <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Upload Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-zinc-200">
                                                <FileText size={16} className="text-zinc-500" />
                                                <span className="font-medium">{log.docName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-zinc-400">
                                            <span className="bg-zinc-800 px-2 py-1 rounded text-xs">v{log.version}</span>
                                        </td>
                                        <td className="p-4">
                                            {log.status === 'active' && (
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                                    <CheckCircle size={12} /> Active
                                                </span>
                                            )}
                                            {log.status === 'archived' && (
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                                                    <Clock size={12} /> Archived
                                                </span>
                                            )}
                                            {log.status === 'decayed' && (
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                    <AlertTriangle size={12} /> Decayed
                                                </span>
                                            )}
                                            {/* Fallback for processing/other statuses */}
                                            {!['active', 'archived', 'decayed'].includes(log.status) && (
                                                <span className="text-xs text-zinc-500 capitalize">{log.status}</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-zinc-400 max-w-md">
                                            {log.changeSummary || 'No summary available'}
                                        </td>
                                        <td className="p-4 text-sm text-zinc-500 whitespace-nowrap">
                                            {new Date(log.uploadedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
