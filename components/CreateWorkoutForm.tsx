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
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="workout" className="block text-gray-700 font-semibold">
                    Workout Name:
                </label>
                <input
                    type="text"
                    id="workout"
                    name="workout"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter workout name..."
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
                >
                    Create Workout
                </button>
            </form>

            {message && (
                <p className="mt-4 text-center text-green-600 font-medium">{message}</p>
            )}
        </div>

    );
}