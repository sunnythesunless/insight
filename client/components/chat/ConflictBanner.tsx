"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConflictBannerProps {
    isVisible: boolean;
}

export default function ConflictBanner({ isVisible }: ConflictBannerProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="sticky top-0 z-20 w-full bg-amber-400/10 border-b border-amber-400/50 backdrop-blur-md"
                >
                    <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-amber-400">
                        <AlertTriangle size={18} />
                        <span className="text-sm font-medium">
                            Potential Conflict Detected: Multiple versions of this document exist.
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
