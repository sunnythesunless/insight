import { FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function KnowledgeMap() {
    return (
        <aside className="hidden lg:flex flex-col w-80 fixed right-0 top-16 bottom-0 border-l border-zinc-800 bg-zinc-900/30 backdrop-blur-sm overflow-y-auto p-4 space-y-6">

            {/* Live Citations Section */}
            <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Live Citations</h3>
                <div className="space-y-2">
                    {/* Mock Citation - Active */}
                    <div className="p-3 bg-amber-400/5 border border-amber-400/20 rounded-lg flex items-start gap-3">
                        <FileText size={16} className="text-amber-400 shrink-0 mt-1" />
                        <div>
                            <p className="text-sm font-medium text-amber-100">Project_Alpha_Q1.pdf</p>
                            <p className="text-xs text-amber-400/60 mt-0.5">Page 14 • Score: 92%</p>
                        </div>
                    </div>
                    {/* Mock Citation - Secondary */}
                    <div className="p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg flex items-start gap-3 opacity-60">
                        <FileText size={16} className="text-zinc-400 shrink-0 mt-1" />
                        <div>
                            <p className="text-sm font-medium text-zinc-300">Employee_Handbook_v4.pdf</p>
                            <p className="text-xs text-zinc-500 mt-0.5">Page 42 • Score: 65%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Summary Section */}
            <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Knowledge Context</h3>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-green-400">System Active</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        Vector search is active on **Finance** and **HR** namespaces. Retrieval latency is 45ms.
                    </p>
                </div>
            </div>

            {/* Version History Section */}
            <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Version History</h3>
                <div className="relative pl-2 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">

                    {/* Timeline Item 1 */}
                    <div className="relative pl-6">
                        <div className="absolute left-0 top-1 w-6 h-6 bg-zinc-900 border border-amber-400/50 rounded-full flex items-center justify-center z-10">
                            <div className="w-2 h-2 bg-amber-400 rounded-full" />
                        </div>
                        <p className="text-sm font-medium text-white">v3.4 Updated (Current)</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Jan 28, 2026 • by John Smith</p>
                    </div>

                    {/* Timeline Item 2 */}
                    <div className="relative pl-6 opacity-50">
                        <div className="absolute left-0 top-1 w-6 h-6 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center z-10">
                            <Clock size={12} className="text-zinc-500" />
                        </div>
                        <p className="text-sm font-medium text-zinc-300">v3.3 Archived</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Jan 15, 2026</p>
                    </div>

                </div>
            </div>

        </aside>
    );
}
