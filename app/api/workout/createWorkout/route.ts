import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2/promise';
import {cookies} from "next/headers"; // Import ResultSetHeader

export async function POST(request: Request) {
    try {
        // Parse the request body
        const { workout, id } = await request.json();
        console.log('Workout:', workout, 'User ID:', id);
        // Validate the input
        if (!workout || typeof workout !== 'string') {
            return NextResponse.json(
                { message: 'Workout name is required' },
                { status: 400 }
            );
        }

        // Insert the workout into the database
        const [result] = await pool.execute(
            'INSERT INTO workouts (user_id, name, started_at) VALUES (?, ?, NOW())',
            [id, workout]
        );

        // Cast the result to ResultSetHeader
        const insertResult = result as ResultSetHeader;
        console.log('Workout created:', insertResult.insertId, 'at', started_at);
        // Return success response
        return NextResponse.json(
            { message: 'Workout created successfully', workoutId: insertResult.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating workout:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}