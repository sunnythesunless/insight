"use client";

import { useEffect, useState } from 'react';
import apiRPC from '@/lib/api';
import EventNode, { EventType } from './EventNode';
import api from '@/lib/api'; // Direct import for flexible calls if needed

interface FeedEvent {
    id: string;
    type: EventType;
    title: string;
    description: string;
    timestamp: string;
    severity?: string;
}

export default function FeedTimeline() {
    const [events, setEvents] = useState<FeedEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                // Determine workspace ID (workaround for MVP similar to Dashboard)
                const wsRes = await apiRPC.getMyWorkspaces();
                const wsId = wsRes.data.workspaces?.[0]?._id;

                if (wsId) {
                    const res = await apiRPC.getActivityFeed(wsId);
                    // Transform backend timestamps to readable relative time if needed
                    // For now, raw provided by backend or we format it.
                    // Let's assume backend sends ISO, we format simply here.
                    const formattedEvents = res.data.feed.map((e: any) => ({
                        ...e,
                        timestamp: new Date(e.timestamp).toLocaleString()
                    }));
                    setEvents(formattedEvents);
                }
            } catch (error) {
                console.error("Failed to load feed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    if (loading) {
        return <div className="text-center text-zinc-500 py-12">Connecting to Neural Network...</div>;
    }

    if (events.length === 0) {
        return <div className="text-center text-zinc-500 py-12">No activity detected yet. The system is dormant.</div>;
    }

    return (
        <div className="relative container mx-auto px-4 py-8">
            {/* Center Line (Desktop) / Left Line (Mobile) */}
            <div className="absolute left-[2.4rem] md:left-1/2 top-0 bottom-0 w-px bg-zinc-800 transform md:-translate-x-1/2" />

            <div className="space-y-4">
                {events.map((event, index) => (
                    <EventNode
                        key={event.id}
                        type={event.type}
                        title={event.title}
                        description={event.description}
                        timestamp={event.timestamp}
                        alignment={index % 2 === 0 ? 'right' : 'left'} // Alternating
                    />
                ))}
            </div>
        </div>
    );
}
