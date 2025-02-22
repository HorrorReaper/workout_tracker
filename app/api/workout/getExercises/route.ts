import {NextResponse} from "next/server";
import pool from "@/lib/db";

export  async function GET() {
    try {

        // Get all exercises from the database
        const [result] = await pool.execute(
            'SELECT * FROM exercises'
        );

        // Return success response
        return NextResponse.json(
            { message: 'Got the exercises: ', exercises : result },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error getting exercises:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}