// app/api/friends/accept/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    const { userId, friendId } = await request.json();

    try {
        // Update friend request status to 'accepted'
        await pool.execute(
            'UPDATE friends SET status = ? WHERE user_id = ? AND friend_id = ?',
            ['accepted', friendId, userId]
        );

        return NextResponse.json({ message: 'Friend request accepted.' });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}