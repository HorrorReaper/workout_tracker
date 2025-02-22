import pool from "@/lib/db";
import {NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function POST(request: Request) {
    try {
        const { exerciseId,  anzahl, setNumber } = await request.json();
        const userId = (await cookies()).get('userId')?.value;
        console.log('User ID:', userId);
        console.log('Exercise ID:', exerciseId);
        console.log('Set Number:', setNumber);
        console.log('Anzahl:', anzahl);
        const [sets] = await pool.execute(
            `SELECT reps, weight, notes, rir, type FROM workout_exercises, workouts WHERE exercise_id = ? AND workout_id = workouts.id AND user_id = ? AND set_number = ? ORDER BY workout_id DESC LIMIT ${anzahl}`,
            [exerciseId, userId, setNumber]
        );
        console.log('Last sets:', sets);
        return NextResponse.json({ sets: sets });
    } catch (error) {
        console.error('Error getting last sets:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}