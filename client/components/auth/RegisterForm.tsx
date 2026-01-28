"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Loader2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import clsx from 'clsx';
import Link from 'next/link';

export default function RegisterForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await api.post('/auth/register', { name, email, password });
            setIsSuccess(true);
        } catch (err: any) {
            if (err.response?.data?.errors) {
                // Handle express-validator errors
                setError(err.response.data.errors[0].message);
            } else {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-glass border border-zinc-800 shadow-2xl backdrop-blur-xl text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="text-green-500" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                <p className="text-zinc-400 mb-8">
                    We've sent a verification link to <span className="text-white font-medium">{email}</span>.
                </p>
                <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-zinc-800 text-white hover:bg-zinc-700 transition-all"
                >
                    Return to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-glass border border-zinc-800 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-zinc-400">Join InsightOps today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-zinc-500" size={18} />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-zinc-600"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase">Email</label>
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

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-zinc-500" size={18} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-zinc-600"
                            placeholder="••••••••"
                            required
                            minLength={6}
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
                            Creating Account...
                        </>
                    ) : (
                        <>
                            Sign Up
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#09090b] px-2 text-zinc-500">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/google`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </button>

                <p className="text-center text-sm text-zinc-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
