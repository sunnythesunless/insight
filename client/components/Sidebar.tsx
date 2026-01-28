"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, FileText, Settings, Database, Code, X, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navItems = [
    { name: 'Chat Intelligence', href: '/', icon: Home },
    { name: 'Pulse Feed', href: '/feed', icon: Activity },
    { name: 'Knowledge Vault', href: '/vault', icon: Database },
    { name: 'Workspace HQ', href: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                className={clsx(
                    "fixed top-0 left-0 z-50 h-full w-64 bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800 transform md:translate-x-0 transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                            <span className="text-black font-bold text-lg">I</span>
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            InsightOps
                        </h1>
                    </div>
                    <button onClick={onClose} className="md:hidden p-1 text-zinc-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose} // Close on click (mobile)
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-zinc-800 text-white border border-zinc-700/50"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                                )}
                            >
                                <item.icon size={20} className={isActive ? "text-amber-400" : ""} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black">
                            JS
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">John Smith</span>
                            <span className="text-xs text-zinc-500">Admin Workspace</span>
                        </div>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
