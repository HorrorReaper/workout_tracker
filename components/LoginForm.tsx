'use client'; // Mark this as a Client Component

import { useState } from 'react';

type LoginFormProps = {
    onSubmit: (email: string) => void;
};

export default function LoginForm({ onSubmit }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError('Email is required');
            return;
        }

        try {
            await onSubmit(email);
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Login</button>
        </form>
    );
}