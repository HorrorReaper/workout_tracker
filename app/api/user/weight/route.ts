import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import {cookies} from "next/headers";

export async function POST(req: Request) {
    try {
        const userid = (await cookies()).get('userId')?.value;
        if (!userid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { weight } = await req.json();
        if (!weight || weight <= 0) {
            return NextResponse.json({ error: "Invalid weight" }, { status: 400 });
        }

        await pool.execute(
            "INSERT INTO weight_entries (user_id, weight) VALUES (?, ?)",
            [userid, weight]
        );

        return NextResponse.json({ message: "Weight saved successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error saving weight:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
export async function GET() {
    try {
        const userid = await (await cookies()).get('userId')?.value;
        if (!userid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const [weights] = await pool.execute(
            "SELECT weight, recorded_at FROM weight_entries WHERE user_id = ? ORDER BY recorded_at DESC",
            [userid]
        );

        return NextResponse.json(weights);
    } catch (error) {
        console.error("Error fetching weights:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

