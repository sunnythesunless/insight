"use client";

import { useState, useRef, useEffect } from 'react';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatSkeleton from '@/components/chat/ChatSkeleton';
import ConflictBanner from '@/components/chat/ConflictBanner';
import { Send, Paperclip, Search, Sparkles } from 'lucide-react';
import apiRPC from '@/lib/api';
import Pulse from '@/components/dashboard/Pulse';
import KnowledgeMap from '@/components/dashboard/KnowledgeMap';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  citations?: any[];
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', content: "Welcome to InsightOps. I'm connected to your workspace knowledge base. How can I assist you today?" }
  ]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConflict, setIsConflict] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- REAL DASHBOARD DATA ---
  const [stats, setStats] = useState({
    integrityScore: 0,
    activeTruths: 0,
    decayAlerts: 0,
    verificationsToday: 0
  });

  useEffect(() => {
    // Fetch Stats on mount
    const fetchStats = async () => {
      try {
        const wsRes = await apiRPC.getMyWorkspaces();
        if (wsRes.data.workspaces && wsRes.data.workspaces.length > 0) {
          const wsId = wsRes.data.workspaces[0]._id;
          const statsRes = await apiRPC.getDashboardStats(wsId);
          setStats(statsRes.data.stats);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add User Message
    const userMsg: Message = { id: Date.now(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);
    setIsConflict(false);

    try {
      const wsRes = await apiRPC.getMyWorkspaces();
      const workspaceId = wsRes.data.workspaces?.[0]?._id;

      if (!workspaceId) {
        throw new Error("No workspace found");
      }

      const response = await apiRPC.queryKnowledge({ query: userMsg.content, workspaceId });

      // Check for conflict
      if (response.data.integrityReport?.potentialConflict) {
        setIsConflict(true);
      }

      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.answer,
        citations: response.data.citations
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "😴 **Gemini is sleeping.** \n\nThe AI service is currently unavailable or experiencing high traffic. Please try again in a few moments."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full relative overflow-hidden bg-obsidian">

      {/* Main Content Area (Center) */}
      <div className="flex-1 flex flex-col h-full relative lg:pr-80">
        <ConflictBanner isVisible={isConflict} />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* 1. The Pulse */}
            <section>
              <Pulse stats={stats} />
            </section>

            {/* 2. The Action Zone (Chat) */}
            <section className="min-h-[500px] flex flex-col gap-4">
              {/* Messages */}
              <div className="flex-1 space-y-6 pb-4">
                {messages.map(msg => (
                  <ChatBubble
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    citations={msg.citations}
                  />
                ))}
                {isLoading && <ChatSkeleton />}
                <div ref={messagesEndRef} />
              </div>
            </section>
          </div>
        </div>

        {/* Floating Search Bar (Bottom Fixed) */}
        <div className="absolute bottom-6 left-4 right-4 md:left-6 md:right-6 lg:right-[22rem] max-w-4xl mx-auto z-20">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2 p-2 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl focus-within:border-amber-400/50 focus-within:ring-1 focus-within:ring-amber-400/20 transition-all">

            <button type="button" className="p-3 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors">
              <Paperclip size={20} />
            </button>

            <div className="flex-1 flex flex-col justify-center">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask InsightOps anything about your office..."
                className="w-full bg-transparent border-0 focus:ring-0 text-zinc-100 placeholder-zinc-500 resize-none py-3 max-h-32 min-h-[48px] text-sm"
                rows={1}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="p-3 bg-amber-400 text-black rounded-xl hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-400/20"
            >
              {isLoading ? <Sparkles size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
        </div>
      </div>

      {/* 3. The Knowledge Map (Right Sidebar) */}
      <KnowledgeMap />

    </div>
  );
}
