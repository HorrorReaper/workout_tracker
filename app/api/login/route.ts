import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
    const { email } = await request.json();

    try {
        // Check if the email exists in the users table
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (rows.length > 0) {
            const user = rows[0];
            console.log('User ID:', user.id);

            // Set cookie in response headers
            const response = NextResponse.json({ message: 'Login successful' });

            response.headers.append(
                'Set-Cookie',
                `userId=${user.id}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
            );

            return response;
        } else {
            return NextResponse.json(
                { message: 'Email not found' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
