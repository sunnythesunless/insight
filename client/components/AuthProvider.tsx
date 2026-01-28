"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Public routes that don't need auth
        const publicRoutes = ['/login', '/register'];

        if (publicRoutes.includes(pathname)) {
            setIsAuthorized(true);
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
        } else {
            setIsAuthorized(true);
        }
    }, [pathname, router]);

    // Prevent flash of protected content
    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
