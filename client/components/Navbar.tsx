"use client";

import { Menu } from 'lucide-react';

interface NavbarProps {
    onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    return (
        <header className="sticky top-0 z-30 w-full md:pl-64 bg-obsidian/80 backdrop-blur-md border-b border-zinc-800">
            <div className="flex items-center h-16 px-4">
                {/* Hamburger menu removed as requested */}
                <div className="flex flex-1 items-center justify-between">
                    {/* Placeholder for future header content */}
                </div>
            </div>
        </header>
    );
}
