import { Activity, ShieldCheck, FileText, Zap, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface PulseCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    trendUp?: boolean;
    color?: string;
}

function PulseCard({ title, value, icon: Icon, trend, trendUp, color = "text-amber-400" }: PulseCardProps) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between hover:border-zinc-700 transition-colors group">
            <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{title}</p>
                <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{value}</span>
                    {trend && (
                        <span className={clsx("text-xs font-medium", trendUp ? "text-green-400" : "text-red-400")}>
                            {trend}
                        </span>
                    )}
                </div>
            </div>
            <div className={clsx("p-3 rounded-lg bg-zinc-800/50 group-hover:bg-zinc-800 transition-colors", color)}>
                <Icon size={20} />
            </div>
        </div>
    );
}

interface PulseProps {
    stats: {
        integrityScore: number;
        activeTruths: number;
        decayAlerts: number;
        verificationsToday: number;
    }
}

export default function Pulse({ stats }: PulseProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <PulseCard
                title="Knowledge Integrity"
                value={`${stats.integrityScore}%`}
                icon={ShieldCheck}
                trend="+2.4%"
                trendUp={true}
                color="text-green-400"
            />
            <PulseCard
                title="Active Truths"
                value={stats.activeTruths.toString()}
                icon={FileText}
                trend="+12"
                trendUp={true}
                color="text-blue-400"
            />
            <PulseCard
                title="Decay Alerts"
                value={stats.decayAlerts.toString()}
                icon={AlertTriangle}
                trend="Action Needed"
                trendUp={false}
                color="text-red-400"
            />
            <PulseCard
                title="Verifications Today"
                value={stats.verificationsToday.toString()}
                icon={Zap}
                trend="High Activity"
                trendUp={true}
                color="text-amber-400"
            />
        </div>
    );
}
