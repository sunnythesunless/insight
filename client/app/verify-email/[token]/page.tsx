"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function VerifyEmailPage({ params }: { params: { token: string } }) {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                // The params are technically a Promise in newer Next.js versions but 
                // in standard client components with dynamic routes, we access them via props or hooks.
                // However, since we are using 'use client', params might not be available immediately if not unwrapped?
                // Actually, let's use the API to verify.
                const { token } = params;

                if (!token) {
                    setStatus('error');
                    setMessage('Invalid verification link.');
                    return;
                }

                await api.get(`/auth/verify-email/${token}`);
                setStatus('success');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may satisfy expired.');
            }
        };

        verifyToken();
    }, [params]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-obsidian relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-400/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="z-10 w-full max-w-md p-8 rounded-2xl bg-zinc-glass border border-zinc-800 shadow-2xl backdrop-blur-xl text-center">
                {status === 'loading' && (
                    <>
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="animate-spin text-amber-400" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verifying Email...</h2>
                        <p className="text-zinc-400">Please wait while we confirm your email address.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-green-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
                        <p className="text-zinc-400 mb-8">
                            Your account has been successfully verified. You can now access InsightOps.
                        </p>
                        <Link
                            href="/login"
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-amber-400 text-black hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
                        >
                            Continue to Login
                            <ArrowRight size={18} />
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="text-red-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                        <p className="text-zinc-400 mb-8">
                            {message}
                        </p>
                        <Link
                            href="/register"
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-zinc-800 text-white hover:bg-zinc-700 transition-all"
                        >
                            Back to Sign Up
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
