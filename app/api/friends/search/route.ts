import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"; // Assuming you have a database connection setup

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ message: "Query parameter is required" }, { status: 400 });
    }

    try {
        const [users] = await pool.execute(
            "SELECT id, name, email FROM users WHERE name LIKE ? OR email LIKE ?",
            [`%${query}%`, `%${query}%`]
        );

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
