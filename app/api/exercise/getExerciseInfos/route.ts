import pool from "@/lib/db";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    try {
        const {exerciseId} = await request.json();
        const [exercise] = await pool.execute('SELECT * FROM exercises WHERE id = ?', [exerciseId]);
        return NextResponse.json({ exercise });
    } catch (error) {
        console.error('Error getting exercises:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}