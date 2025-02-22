'use client'; // Mark this as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function CreateWorkoutForm({ userId }: { userId: number }) {
    const [workoutName, setWorkoutName] = useState('');
    const [message, setMessage] = useState('');
    console.log('User ID:', userId);
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/workout/createWorkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workout: workoutName,
                    id: userId, // Replace with the actual user ID (e.g., from session or context)
                }),
            });

            const data = await response.json();
            console.log('Response:', data);

            if (response.ok) {
                setMessage(`Workout created successfully! ID: ${data.workoutId}`);

                setWorkoutName(''); // Clear the input
                console.log('Redirecting to workout page...');
                router.push(`/workout/${data.workoutId}`);

            } else {
                setMessage(data.message || 'Failed to create workout');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage(`An error occurred. Please try again. ${error}`);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="workout">Workout:</label>
                <input
                    type="text"
                    id="workout"
                    name="workout"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    required
                />
                <button type="submit">Create Workout</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}