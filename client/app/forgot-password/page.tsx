"use client";

import { useState } from 'react';
import { Mail, Loader2, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import apiRPC from '@/lib/api';
import clsx from 'clsx';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await apiRPC.forgotPassword({ email });
            setIsSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-obsidian relative overflow-hidden pb-40">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-400/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="flex flex-col items-center gap-6 z-10 w-full px-4 max-w-md">
                <div className="text-center mb-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Reset Password</h1>
                    <p className="text-zinc-400">Enter your email to receive recovery instructions.</p>
                </div>

                <div className="w-full p-8 rounded-2xl bg-zinc-glass border border-zinc-800 shadow-2xl backdrop-blur-xl">
                    {isSent ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Check your inbox</h3>
                            <p className="text-zinc-400 text-sm">
                                We have sent password reset instructions to <span className="text-white font-medium">{email}</span>
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 text-amber-400 hover:text-amber-300 font-medium mt-4"
                            >
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-zinc-500 uppercase">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-zinc-500" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-zinc-600"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={clsx(
                                    "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all mt-6",
                                    isLoading
                                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                        : "bg-amber-400 text-black hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Reset Link
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <div className="text-center mt-4">
                                <Link href="/login" className="text-sm text-zinc-500 hover:text-white transition-colors">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
