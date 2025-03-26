"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthenticateUser } from "@/actions/user";

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        async function authenticate() {
            try {
                const auth = await onAuthenticateUser();

                if (auth.status === 200 || auth.status === 201) {
                    router.replace(`/dashboard/${auth.user?.workspace[0].id}`);
                } else if ([400, 500, 403].includes(auth.status)) {
                    router.replace('/auth/signin');
                } else {
                    router.replace('/auth/signin');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                router.replace('/auth/signin');
            }
        }

        authenticate();
    }, [router]);

    // Render a loading state or null while authenticating
    return null;
}