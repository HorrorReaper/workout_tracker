'use client';
import { useState } from "react";

export default function AddCustomExercise() {
    const [description, setDescription] = useState('');
    const [muscleGroups, setMuscleGroups] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/exercise/addExercise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description,
                muscle_groups: muscleGroups,
                image_url: imageUrl
            }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage("Exercise added successfully!");
            setDescription('');
            setMuscleGroups('');
            setImageUrl('');
        } else {
            setMessage(`Error: ${data.message}`);
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-bold mb-2">Add Your Own Exercise</h2>
            {message && <p className="text-green-500">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Exercise Name"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="border p-2 rounded w-full mb-2"
                />
                <input
                    type="text"
                    placeholder="Muscle Groups (comma-separated)"
                    value={muscleGroups}
                    onChange={(e) => setMuscleGroups(e.target.value)}
                    required
                    className="border p-2 rounded w-full mb-2"
                />
                <input
                    type="text"
                    placeholder="Image URL (optional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Add Exercise
                </button>
            </form>
        </div>
    );
}
