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
        <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">🏋️ Add Your Own Exercise</h2>

            {/* Success Message */}
            {message && <p className="text-green-600 text-sm bg-green-100 p-2 rounded-md">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Exercise Name */}
                <div>
                    <label htmlFor="exercise-name" className="block text-sm font-medium text-gray-700">
                        Exercise Name
                    </label>
                    <input
                        id="exercise-name"
                        type="text"
                        placeholder="e.g. Bench Press"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                {/* Muscle Groups (Multi-Select) */}
                <div>
                    <label htmlFor="muscle-groups" className="block text-sm font-medium text-gray-700">
                        Target Muscle Groups
                    </label>
                    <select
                        id="muscle-groups"
                        multiple
                        value={selectedMuscleGroups}
                        onChange={handleMuscleGroupChange}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        {muscleGroups.map((muscle) => (
                            <option key={muscle} value={muscle}>
                                {muscle}
                            </option>
                        ))}
                    </select>
                    {/* Selected Muscle Groups Display */}
                    {selectedMuscleGroups.length > 0 && (
                        <p className="mt-2 text-sm text-gray-600">
                            Selected: <span className="font-semibold">{selectedMuscleGroups.join(', ')}</span>
                        </p>
                    )}
                </div>

                {/* Image URL */}
                <div>
                    <label htmlFor="image-url" className="block text-sm font-medium text-gray-700">
                        Image URL (optional)
                    </label>
                    <input
                        id="image-url"
                        type="text"
                        placeholder="Paste image link here..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                >
                    ➕ Add Exercise
                </button>
            </form>
        </div>

    );
}
