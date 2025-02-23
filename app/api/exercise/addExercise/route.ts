import { NextResponse } from "next/server";
import pool from "@/lib/db";
import {cookies} from "next/headers";  // Ensure this points to your DB connection

export async function POST(req: Request) {
    try {
        const { description, muscle_groups, image_url} = await req.json();
        const  userId  = (await cookies()).get('userId')?.value;

        if (!description || !muscle_groups || !userId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const query = `
            INSERT INTO exercises (description, muscle_groups, image_url, user_id) 
            VALUES (?, ?, ?, ?)
        `;

        await pool.execute(query, [description, muscle_groups, image_url, userId]);

        return NextResponse.json({ message: "Exercise added successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Error adding exercise:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
