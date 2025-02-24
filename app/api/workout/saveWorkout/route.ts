import {NextResponse} from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { exercises, workoutId } = await request.json();
        for (const exercise of exercises) {
            if (exercise.sets) {
                let i = 1;
                for (const set of exercise.sets) {
                    await pool.execute(
                        'INSERT INTO workout_exercises (exercise_id,workout_id, reps, weight, set_number, notes, rir, type) VALUES (?,?, ?, ?, ?, ?, ?, ?)',
                        [exercise.id,workoutId, set.reps, set.weight, i, set.notes, set.rir, set.type]
                    );
                    i++;
                }
            }
        }
        const [result] = await pool.execute('UPDATE workouts SET finished_at = ? WHERE id = ?', [new Date(), workoutId]);

        return NextResponse.json({ message: 'Workout saved successfully' });
    }catch (error) {
        console.error('Error saving workout:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}