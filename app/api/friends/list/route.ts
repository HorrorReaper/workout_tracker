// app/api/friends/list/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    const { userId } = await request.json();

    try {
        // Get accepted friends
        const [friends] = await pool.execute(
            `SELECT u.id, u.name, u.email 
       FROM friends f
       JOIN users u ON u.id = f.friend_id
       WHERE f.user_id = ? AND f.status = ?`,
            [userId, 'accepted']
        );

        return NextResponse.json({ friends });
    } catch (error) {
        console.error('Error fetching friends:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}