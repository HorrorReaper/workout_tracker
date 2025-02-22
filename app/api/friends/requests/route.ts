import {NextResponse} from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
    const { userId } = await request.json();
    try{
        const [friendRequests] = await pool.execute(
            `SELECT u.id, u.name, u.email
            FROM friends f
            JOIN users u ON u.id = f.user_id
            WHERE f.friend_id = ? AND f.status = ?`,
            [userId, 'pending']
        );
        console.log('Friend requests:', friendRequests);
        return NextResponse.json({ friendRequests });
    }catch(error){
        console.error('Error fetching friend requests:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}