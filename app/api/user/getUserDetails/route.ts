import pool from "@/lib/db";
import {NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function POST(request: Request) {
    const { id } = await request.json();
    try {
        const [user] = await pool.execute('SELECT name, created_at, profile_picture_url FROM users WHERE id = ?', [id]);
        const [lastWorkouts] = await pool.execute(
            `
                SELECT
                    w.id AS workout_id,
                    w.user_id,
                    w.started_at,
                    w.name,
                    -- Aggregate sets as a JSON array; if there are no sets, it will be NULL
                    JSON_ARRAYAGG(
                            JSON_OBJECT(
                                    'id', e.set_id,
                                    'exercise_id', e.exercise_id,
                                    'exercise_name', ex.description,
                                    'set_number', e.set_number,
                                    'reps', e.reps,
                                    'weight', e.weight,
                                    'notes', e.notes,
                                    'type', e.type,
                                    'RIR', e.RIR
                            )
                    ) AS sets
                FROM workouts w
                         LEFT JOIN workout_exercises e ON w.id = e.workout_id
                         JOIN exercises ex ON e.exercise_id = ex.id
                WHERE w.user_id = ?
                GROUP BY w.id
                ORDER BY w.started_at DESC
                    LIMIT 5
            `, [id]
        );
        const [maxWeights] = await pool.execute('SELECT workouts.user_id, description, MAX(weight) AS max_weight FROM workout_exercises, workouts, exercises WHERE workouts.id = workout_id AND workouts.user_id = ? AND exercises.id = exercise_id GROUP BY workouts.user_id, description;', [id]);
        console.log('Max Weights:', maxWeights);
        console.log('User details:', user);
        console.log('Last workouts:', lastWorkouts);
        if(id === (await (cookies())).get('userId')?.value){
            console.log("Current user");
            return NextResponse.json({user, lastWorkouts, maxWeights, isCurrentUser: true});
        }
        console.log("Not current user");
        return NextResponse.json({user, lastWorkouts, maxWeights, isCurrentUser: false});
    }catch (e) {
        console.error('Error getting last workouts:', e);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}