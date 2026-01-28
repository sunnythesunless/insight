"use client";

import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
// import Navbar from "@/components/Navbar"; // Removed
import AuthProvider from "@/components/AuthProvider";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-obsidian text-foreground overflow-hidden`}>
        <div className="flex h-screen">
          {/* Sidebar (Fixed on Desktop, Hidden on Mobile) - Hide on Auth Pages */}
          {!isAuthPage && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

          {/* Main Content Area */}
          <div className={`flex-1 flex flex-col transition-all duration-300 ${!isAuthPage ? 'md:pl-64' : ''}`}>
            {/* Navbar - Hide on Auth Pages */}
            {/* Navbar Removed */}

            <main className="flex-1 overflow-y-auto relative">
              <AuthProvider>
                {children}
              </AuthProvider>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
