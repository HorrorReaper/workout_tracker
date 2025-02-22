import pool from "@/lib/db";
import {NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function POST(request: Request) {
    const { exerciseId, setNumber } = await request.json();
    const userId = (await cookies()).get('userId')?.value;
    console.log('User ID:', userId);
    console.log('Exercise ID:', exerciseId);
    try {
        // Get accepted friends
        const [friends_sets] = await pool.execute(
            `SELECT
                 f.friend_id AS friend_id,
                 e.weight,
                 e.reps,
                 e.created_at,
                 u.name
             FROM
                 workout_exercises e
                     JOIN
                 workouts w ON w.id = e.workout_id
                     JOIN
                 friends f ON f.friend_id = w.user_id
                    JOIN 
                users u ON u.id = f.friend_id
             WHERE
                 f.user_id = ?
               AND f.status = 'accepted'
               AND e.exercise_id = ?
               AND e.set_number = ?
               AND e.created_at = (
                 SELECT MAX(e2.created_at)
                 FROM workout_exercises e2
                          JOIN workouts w2 ON w2.id = e2.workout_id
                 WHERE e2.exercise_id = e.exercise_id
                   AND w2.user_id = f.friend_id
             )
             ORDER BY
                 e.created_at DESC`,
            [userId, exerciseId, setNumber]
        );

        console.log('Friends sets:', friends_sets);
        return NextResponse.json({ friends_sets });
    } catch (error) {
        console.error('Error fetching friends:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}