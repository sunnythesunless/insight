"use client";

import { User, Shield, MoreVertical, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

const initialMembers = [
    { id: 1, name: 'John Smith', email: 'john@startup.com', role: 'admin', avatar: 'JS' },
    { id: 2, name: 'Sarah Jones', email: 'sarah@startup.com', role: 'member', avatar: 'SJ' },
    { id: 3, name: 'Mike Ross', email: 'mike@startup.com', role: 'member', avatar: 'MR' },
];

export default function MemberList() {
    const [members, setMembers] = useState(initialMembers);

    return (
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-white">Team Members</h2>
                    <p className="text-sm text-zinc-400">Manage access and roles for your workspace.</p>
                </div>
                <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors">
                    Add Member
                </button>
            </div>

            <div className="space-y-4">
                {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-sm font-bold text-white">
                                {member.avatar}
                            </div>
                            <div>
                                <h3 className="font-medium text-zinc-100">{member.name}</h3>
                                <p className="text-xs text-zinc-500">{member.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className={clsx(
                                "px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5",
                                member.role === 'admin'
                                    ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                                    : "bg-zinc-800 text-zinc-400 border-zinc-700"
                            )}>
                                {member.role === 'admin' && <Shield size={12} />}
                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                            </span>

                            <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors">
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
