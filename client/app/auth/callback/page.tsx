"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const userStr = searchParams.get('user');

        if (accessToken && refreshToken && userStr) {
            try {
                // Save to LocalStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', userStr); // It's already stringified

                // Redirect to Dashboard (Force reload)
                window.location.href = '/';
            } catch (err) {
                console.error("Failed to parse user data", err);
                router.push('/login?error=auth_failed');
            }
        } else {
            console.error("Missing tokens in callback URL");
            // router.push('/login?error=missing_tokens');
        }
    }, [searchParams, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-obsidian text-white">
            <Loader2 className="animate-spin mb-4 text-amber-400" size={48} />
            <h2 className="text-xl font-bold">Authenticating...</h2>
            <p className="text-zinc-400">Please wait while we log you in.</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-obsidian"></div>}>
            <CallbackHandler />
        </Suspense>
    );
}
