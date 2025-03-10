/*'use client';
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
}*/
'use client';
import { useEffect, useState } from 'react';
import { muscleGroups } from '@/lib/utils';
import AddCustomExerciseButton from '@/components/workout/addCustomExerciseButton';

type Exercise = {
    id: number;
    description: string;
    image_url: string;
    muscle_groups: string[];
};

export default function SearchExercisePopover({
                                                  onExerciseSelect,
                                              }: {
    onExerciseSelect: (exercises: Exercise[]) => void;
}) {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');

    // New state: selected exercises array
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

    const fetchExercises = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (searchQuery) queryParams.append('searchQuery', searchQuery);
            if (selectedMuscleGroup) queryParams.append('muscleGroup', selectedMuscleGroup);

            const response = await fetch(`/api/workout/getExercises?${queryParams.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch exercises');
            const data = await response.json();
            setExercises(data.exercises);
            setFilteredExercises(data.exercises);
        } catch (err) {
            console.error('Error fetching exercises:', err);
            setError('Failed to load exercises. Please try again later.');
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

    // Toggle selection for an exercise
    const toggleExerciseSelection = (exercise: Exercise) => {
        setSelectedExercises(prev => {
            if (prev.some(ex => ex.id === exercise.id)) {
                return prev.filter(ex => ex.id !== exercise.id);
            }
            return [...prev, exercise];
        });
    };

    // When user clicks the "Add Selected Exercises" button,
    // call the onExerciseSelect callback with the selected exercises.
    const handleAddSelectedExercises = () => {
        onExerciseSelect(selectedExercises);
        setSelectedExercises([]); // Clear selection after adding
    };

    return (
        <div className="p-4">
            {/* Muscle Group Filter */}
            <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
            >
                <option value="">All Muscle Groups</option>
                {muscleGroups.map((group) => (
                    <option key={group} value={group}>
                        {group}
                    </option>
                ))}
            </select>

            {/* Search Field */}
            <input
                className="rounded-2xl py-2 px-5 border-2 border-blue-400 w-full"
                type="text"
                placeholder="Search for an exercise"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {loading && <div>Loading exercises...</div>}
            {error && <div className="text-red-500">{error}</div>}

            {/* List of Exercises */}
            <div className="mt-4 space-y-2">
                {filteredExercises.map((exercise) => (
                    <div
                        key={exercise.id}
                        className={`border p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 flex items-center ${
                            selectedExercises.some((ex) => ex.id === exercise.id)
                                ? 'bg-green-100'
                                : ''
                        }`}
                        onClick={() => toggleExerciseSelection(exercise)}
                    >
                        {exercise.image_url && (
                            <img
                                src={exercise.image_url}
                                alt={exercise.description}
                                className="w-16 h-16 object-cover rounded mr-4"
                            />
                        )}
                        <div>
                            <h2 className="text-xl font-semibold">{exercise.description}</h2>
                            <p className="text-sm text-gray-500">
                                {Array.isArray(exercise.muscle_groups)
                                    ? exercise.muscle_groups.join(', ')
                                    : exercise.muscle_groups.split(',').map(g => g.trim()).join(', ')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Button to Add Selected Exercises */}
            {selectedExercises.length > 0 && (
                <button
                    onClick={handleAddSelectedExercises}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                >
                    Add Selected Exercises ({selectedExercises.length})
                </button>
            )}

            {/* Optionally, the AddCustomExerciseButton can be displayed here */}
            <div className="mt-4">
                <AddCustomExerciseButton />
            </div>
        </div>
    );
}
