import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import pool from "@/lib/db";

export async function GET() {
    const  userId  = (await cookies()).get('userId')?.value;

    try {
        const query = "SELECT * FROM workouts WHERE user_id = ? AND finished_at IS NULL";

        const [workouts] = await pool.execute(query, [userId]);
        return NextResponse.json({ workouts });
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch workouts: ", err }, { status: 500 });
    }
}