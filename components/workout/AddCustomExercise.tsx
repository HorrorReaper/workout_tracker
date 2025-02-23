'use client';
import { useState } from "react";
import {muscleGroups} from "@/lib/utils";

export default function AddCustomExercise() {
    const [description, setDescription] = useState('');
    const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [message, setMessage] = useState('');
    const handleMuscleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedMuscleGroups(selectedOptions);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/exercise/addExercise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description,
                muscle_groups: selectedMuscleGroups.join(', '),
                image_url: imageUrl
            }),
        });


        const data = await response.json();
        if (response.ok) {
            setMessage("Exercise added successfully!");
            setDescription('');
            setSelectedMuscleGroups([]);
            setImageUrl('');
        } else {
            setMessage(`Error: ${data.message}`);
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-bold mb-2">Add Your Own Exercise</h2>
            {message && <p className="text-green-500">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Exercise Name */}
                <div>
                    <label htmlFor="exercise-name">Exercise Name</label>
                    <input
                        id="exercise-name"
                        type="text"
                        placeholder="Exercise Name"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                {/* Muscle Groups (Multi-Select) */}
                <div>
                    <label>Muscle Groups</label>
                    <select
                        id="muscle-groups"
                        multiple
                        value={selectedMuscleGroups}
                        onChange={handleMuscleGroupChange}
                        className="border rounded-md p-2 w-full"
                    >
                        {muscleGroups.map((muscle) => (
                            <option key={muscle} value={muscle}>
                                {muscle}
                            </option>
                        ))}
                    </select>
                    {/* Show selected muscle groups */}
                    {selectedMuscleGroups.length > 0 && (
                        <p className="mt-2 text-sm text-gray-600">
                            Selected: {selectedMuscleGroups.join(', ')}
                        </p>
                    )}
                </div>

                {/* Image URL */}
                <div>
                    <label htmlFor="image-url">Image URL (optional)</label>
                    <input
                        id="image-url"
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full">
                    Add Exercise
                </button>
            </form>
        </div>
    );
}
