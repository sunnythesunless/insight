"use client";

import { AlertTriangle, Clock, RefreshCw, CheckCircle2, LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export type EventType = 'conflict' | 'decay' | 'version' | 'system';

interface EventNodeProps {
    type: EventType;
    title: string;
    description: string;
    timestamp: string;
    alignment: 'left' | 'right';
}

const config: Record<EventType, { icon: LucideIcon, color: string, glow: string }> = {
    conflict: {
        icon: AlertTriangle,
        color: 'text-amber-400 border-amber-400 bg-amber-400/10',
        glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)] ring-amber-400/20'
    },
    decay: {
        icon: Clock,
        color: 'text-red-500 border-red-500 bg-red-500/10',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)] ring-red-500/20'
    },
    version: {
        icon: RefreshCw,
        color: 'text-blue-400 border-blue-400 bg-blue-400/10',
        glow: 'shadow-[0_0_15px_rgba(96,165,250,0.3)] ring-blue-400/20'
    },
    system: {
        icon: CheckCircle2,
        color: 'text-emerald-400 border-emerald-400 bg-emerald-400/10',
        glow: 'shadow-[0_0_15px_rgba(52,211,153,0.3)] ring-emerald-400/20'
    }
};

export default function EventNode({ type, title, description, timestamp, alignment }: EventNodeProps) {
    const { icon: Icon, color, glow } = config[type];

    return (
        <div className={clsx(
            "flex items-center justify-between w-full mb-8 relative",
            alignment === 'left' ? "flex-row-reverse" : "" // On mobile this will be overridden by parent flex-col logic usually, but for alternating timeline:
            // Actually, standard alternating timeline usually relies on a central axis.
            // Let's assume the parent container handles the generic css grid or flex, 
            // but here we define the content block side.
        )}>
            {/* Spacer for the other side (Desktop only) */}
            <div className="hidden md:block w-5/12" />

            {/* Center Node */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 z-10 flex items-center justify-center">
                <div className={clsx(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center bg-zinc-950 ring-4 transition-all duration-300",
                    color,
                    glow
                )}>
                    <Icon size={18} />
                </div>
            </div>

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={clsx(
                    "w-[calc(100%-3rem)] md:w-5/12 ml-16 md:ml-0 p-5 rounded-2xl border bg-zinc-900/50 backdrop-blur-sm transition-all hover:bg-zinc-800/50",
                    type === 'conflict' ? "border-amber-400/30" : "border-zinc-800",
                    alignment === 'left' ? "md:mr-auto md:text-right" : "md:ml-auto"
                )}
            >
                <div className={clsx("flex flex-col gap-1", alignment === 'left' ? "md:items-end" : "")}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-zinc-500">{timestamp}</span>
                        <span className={clsx("text-xs font-bold uppercase px-2 py-0.5 rounded-full border", color.replace('text-', 'border-').split(' ')[1])}>
                            {type}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                        {description}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
