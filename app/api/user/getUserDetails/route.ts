import pool from "@/lib/db";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    const { id } = await request.json();
    const [user] = await pool.execute('SELECT name, created_at, profile_picture_url FROM users WHERE id = ?', [id]);
    const [lastWorkouts] = await pool.execute('SELECT * FROM workouts WHERE user_id = ? ORDER BY started_at DESC LIMIT 5', [id]);
    console.log('User details:', user);
    console.log('Last workouts:', lastWorkouts);
    return NextResponse.json({ user, lastWorkouts });
}