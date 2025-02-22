// app/api/friends/send/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    const { userId, friendId } = await request.json();

    try {
        // Check if the friend request already exists
        const [existing] = await pool.execute(
            'SELECT * FROM friends WHERE user_id = ? AND friend_id = ?',
            [userId, friendId]
        );

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (existing.length > 0) {
            return NextResponse.json(
                { message: 'Friend request already sent.' },
                { status: 400 }
            );
        }

        // Insert new friend request
        await pool.execute(
            'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)',
            [userId, friendId, 'pending']
        );

        return NextResponse.json({ message: 'Friend request sent.' });
    } catch (error) {
        console.error('Error sending friend request:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}