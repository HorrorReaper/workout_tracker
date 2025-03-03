'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (email: string) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Required for cookies!
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect AFTER the response completes
                router.push('/');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.', err);
        }
    };

    return (
        <div className="container">
            <h1>Login</h1>
            {error && <p className="text-red-500">{error}</p>}
            <LoginForm onSubmit={handleLogin} />
        </div>
    );
}
