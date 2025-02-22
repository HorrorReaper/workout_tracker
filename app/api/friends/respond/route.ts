// app/api/friends/respond/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    const { requestId, accept } = await request.json();

    try {
        if (accept) {
            // Accept request by creating mutual friendship
            const [requestData] = await pool.query(
                'SELECT user_id, friend_id FROM friends WHERE id = ?',
                [requestId]
            );
            console.log('requestData:', requestData);

            await pool.query(
                'UPDATE friends SET status = ? WHERE id = ?',
                ['accepted', requestId]
            );

            // Create reverse relationship
            await pool.query(
                'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)',
                [requestData[0].friend_id, requestData[0].user_id, 'accepted']
            );
        } else {
            // Delete the request
            await pool.query('DELETE FROM friends WHERE id = ?', [requestId]);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error handling friend request:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}