"use client";

import VaultHeader from '@/components/vault/VaultHeader';
import DocumentTable from '@/components/vault/DocumentTable';
import { useState, useEffect } from 'react';
import apiRPC from '@/lib/api';

interface Document {
    id: string; // Changed from number to string for Mongo ObjectId
    title: string;
    status: 'active' | 'decayed' | 'processing' | 'archived';
    version: string;
    added: string;
    confidence: string;
}

export default function VaultPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const wsRes = await apiRPC.getMyWorkspaces();
                if (wsRes.data.workspaces && wsRes.data.workspaces.length > 0) {
                    const wsId = wsRes.data.workspaces[0]._id;
                    const docRes = await apiRPC.getDocuments(wsId);

                    const realDocs = docRes.data.documents.map((d: any) => ({
                        id: d._id,
                        title: d.docName,
                        status: d.status,
                        version: `v${d.version}.0`,
                        added: new Date(d.createdAt).toLocaleDateString(),
                        confidence: '100%'
                    }));
                    setDocuments(realDocs);
                }
            } catch (err) {
                console.error("Failed to load vault", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDocs();
    }, []);

    const handleRefresh = (id: string) => {
        console.log("Refreshing doc", id);
    };

    return (
        <div className="flex h-full bg-obsidian text-zinc-100 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative overflow-y-auto scrollbar-hide">
                <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
                    <VaultHeader
                        totalDocs={documents.length}
                        activeDocs={documents.filter(d => d.status === 'active').length}
                    />

                    <div className="mt-8 space-y-4">
                        {loading ? (
                            <div className="text-zinc-500">Scanning Vault...</div>
                        ) : (
                            <DocumentTable documents={documents} onRefresh={handleRefresh} />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
