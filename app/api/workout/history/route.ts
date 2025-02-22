import pool from "@/lib/db";
import { NextResponse } from "next/server";
import {cookies} from "next/headers";

export async function POST(request: Request) {
    const { exerciseId, mode } = await request.json();
    const userId = (await cookies()).get('userId')?.value;
    if (!exerciseId) return NextResponse.json({ error: "Missing exerciseId" }, { status: 400 });


    try {
        let query = '';
        if(mode === 'all') {
            query = `SELECT created_at, weight, reps FROM workout_exercises, workouts w WHERE exercise_id = ? AND w.id = workout_id AND user_id = ? ORDER BY created_at ASC`;
        }else if(mode === 'heaviest'){
            query = `SELECT created_at, MAX(weight) AS weight, MAX(reps) AS reps FROM workout_exercises, workouts w WHERE exercise_id = ? AND w.id = workout_id AND user_id = ? GROUP BY created_at ORDER BY created_at ASC`;
        }
        const [results] = await pool.execute(query, [exerciseId, userId]);
        console.log("Workout history:", results);
        return NextResponse.json(results);
    } catch (error) {
        console.error("Error fetching workout history:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
