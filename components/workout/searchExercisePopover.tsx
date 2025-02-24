'use client';
import { useEffect, useState } from 'react';
import {muscleGroups} from "@/lib/utils";
import AddCustomExerciseButton from "@/components/workout/addCustomExerciseButton";

type Exercise = {
    id: number;
    description: string;
    image_url: string;
    muscle_groups: string[];
};

export default function SearchExercisePopover({
                                                  onExerciseSelect,
                                              }: {
    onExerciseSelect: (exercise: Exercise) => void;
}) {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");


    const fetchExercises = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (searchQuery) queryParams.append("searchQuery", searchQuery);
            if (selectedMuscleGroup) queryParams.append("muscleGroup", selectedMuscleGroup);

            const response = await fetch(`/api/workout/getExercises?${queryParams.toString()}`);
            if (!response.ok) throw new Error("Failed to fetch exercises");

            const data = await response.json();
            setExercises(data.exercises);
            setFilteredExercises(data.exercises);
        } catch (err) {
            console.error("Error fetching exercises:", err);
            setError("Failed to load exercises. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchExercises();
    }, [searchQuery, selectedMuscleGroup]);



    useEffect(() => {
        if (searchQuery) {
            const filtered = exercises.filter((exercise) =>
                exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredExercises(filtered);
        } else {
            setFilteredExercises(exercises);
        }
    }, [searchQuery, exercises]);

    return (
        <div className="p-4">
            <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
            >
                <option value="">All Muscle Groups</option>
                {muscleGroups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                ))}
            </select>
            <input
                className="rounded-2xl py-2 px-5 border-2 border-blue-400 w-full"
                type="text"
                placeholder="Search for an exercise"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {loading && <div>Loading exercises...</div>}
            {error && <div className="text-red-500">{error}</div>}
            <div className="mt-4">
                {filteredExercises.map((exercise) => (
                    <div
                        key={exercise.id}
                        className="border p-4 rounded-lg shadow-sm mb-2 cursor-pointer hover:bg-gray-100 flex"
                        onClick={() => onExerciseSelect(exercise)}
                    >

                        {exercise.image_url && (
                            <img
                                src={exercise.image_url}
                                alt={exercise.description}
                                className="mt-2 w-24 h-24 object-cover rounded"
                            />
                        )}
                        <h2 className="text-xl font-semibold align-middle">{exercise.description}</h2>
                    </div>
                ))}
            </div>
            <AddCustomExerciseButton />
        </div>
    );
}