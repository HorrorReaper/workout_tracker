import {NextResponse} from "next/server";
import pool from "@/lib/db";
import {cookies} from "next/headers";

/*export  async function GET() {
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
}*/
export async function GET(request: Request) {
    const { searchQuery, muscleGroup } = Object.fromEntries(new URL(request.url).searchParams);
    const  userId  = (await cookies()).get('userId')?.value;

    try {
        let query = "SELECT * FROM exercises WHERE (user_id IS NULL OR user_id = ?)";
        let params: any[] = [userId];

        if (searchQuery) {
            query += " AND description LIKE ?";
            params.push(`%${searchQuery}%`);
        }

        if (muscleGroup) {
            query += " AND muscle_groups LIKE ?";
            params.push(`%${muscleGroup}%`);
        }

        const [exercises] = await pool.execute(query, params);
        return NextResponse.json({ exercises });
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch exercises: ", err }, { status: 500 });
    }
}