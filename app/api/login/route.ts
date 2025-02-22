import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    const { email } = await request.json();

    try {
        // Check if the email exists in the users table
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (Array.isArray(rows)) {
            if (rows.length > 0) {
                // Email exists, login successful
                return NextResponse.json({ message: 'Login successful' });
            } else {
                // Email does not exist
                return NextResponse.json(
                    { message: 'Email not found' },
                    { status: 401 }
                );
            }
        }
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}