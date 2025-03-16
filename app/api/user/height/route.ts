import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
    try {
        const userid = (await cookies()).get('userId')?.value;
        if (!userid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { height } = await req.json();
        if (!height || height <= 0) {
            return NextResponse.json({ error: "Invalid height" }, { status: 400 });
        }

        await pool.execute(
            "UPDATE users SET height = ? WHERE id = ?",
            [height, userid]
        );

        return NextResponse.json({ message: "Height saved successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error saving height:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}