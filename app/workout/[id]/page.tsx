'use client';
import * as React from 'react';
import WorkoutTimer from '@/components/workout/WorkoutTimer';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddExerciseButton from '@/components/workout/addExerciseButton';
import { Exercise } from '@/types';
import { useEffect, useState } from "react";
import ExerciseComparison from "@/components/workout/ExerciseComparison";
import PauseTimer from "@/components/workout/pauseTImer";
import FriendsComparisation from "@/components/workout/FriendsComparisation";
import {router} from "next/client";

export default function WorkoutTrackerPage({ params }) {
    const { id } = React.use(params);
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>('normal'); // Default value is "normal"
    const [celebrationMessage, setCelebrationMessage] = useState<string>(''); // New state
    const [Pause, setPause] = useState(false);

    // Load selected exercises from localStorage on component mount
    useEffect(() => {
        const savedExercises = localStorage.getItem('selectedExercises');
        if (savedExercises) {
            setSelectedExercises(JSON.parse(savedExercises));
        }
    }, []);

    // Save selected exercises to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('selectedExercises', JSON.stringify(selectedExercises));
    }, [selectedExercises]);

    // Callback to handle exercise selection
    /*const handleExerciseSelect = (exercise: Exercise) => {
        setSelectedExercises((prev) => [...prev, exercise]);
    };*/
    const handleExerciseSelect = (exercises: Exercise[]) => {
        setSelectedExercises((prev) => [...prev, ...exercises]);
    };


    // Callback to handle adding sets
    const handleAddSet = async (exerciseId: number, reps: number, weight: number, notes: string, rir: number, type: string) => {
        let setNumber = selectedExercises.find(e => e.id === exerciseId)?.sets?.length || 0;
        setNumber++;
        setSelectedExercises((prev) =>
            prev.map((exercise) =>
                exercise.id === exerciseId
                    ? {
                        ...exercise,
                        sets: [
                            ...(exercise.sets || []),
                            { reps, weight, notes, rir, type },
                        ],
                    }
                    : exercise
            )
        );
        //Wenn gewicht oder reps gesteigert wurden, wird ein Toast ausgegeben
        try {
            const anzahl = 1;
            const response = await fetch('/api/workout/getLastSets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exerciseId, anzahl, setNumber}),
            });
            const data = await response.json();
            if (data.sets.length > 0) {
                console.log('data', data);
                console.log('data', data);
                console.log('weight', data.sets[0].weight, " neu:", weight);
                console.log('reps', data.sets[0].reps, " neu:", reps);
            }

            if (!response.ok) throw new Error('Failed to fetch last sets.');
            if(data.sets.length > 0 && data.sets[0].weight < weight && data.sets[0].reps === reps && type === 'normal') {
                console.log('You have improved!');
                setCelebrationMessage('You have improved the weight by ' + (weight - data.sets[0].weight) + ' kg!');
                const timer = setTimeout(() => {
                    setCelebrationMessage('');
                }, 1000);
                clearTimeout(timer);
            }
            else if ( data.sets.length > 0 &&  data.sets[0].reps < reps && data.sets[0].weight === weight && type === 'normal') {
                console.log('You have improved!');
                setCelebrationMessage('You have improved the reps by ' + (reps - data.sets[0].reps) + ' reps!');
                const timer = setTimeout(() => {
                    setCelebrationMessage('');
                }, 1000);
                clearTimeout(timer);
            }
            else if(data.sets.length > 0 &&  data.sets[0].weight < weight && data.sets[0].reps < reps && type === 'normal') {
                console.log('You have improved!');
                setCelebrationMessage('You have improved the weight by ' + (weight - data.sets[0].weight) + ' kg and the reps by ' + (reps - data.sets[0].reps) + ' reps!');
                const timer = setTimeout(() => {
                    setCelebrationMessage('');
                }, 1000);
                clearTimeout(timer);
            }
            setPause(true);
        }catch (e) {
            console.error('Error fetching last sets:', e);
        }
    };
    const handleDeleteSet = (exerciseId: number, setIndex: number) => {
        setSelectedExercises(prev =>
            prev.map(exercise => {
                if (exercise.id === exerciseId) {
                    return {
                        ...exercise,
                        sets: exercise.sets?.filter((_, index) => index !== setIndex) || []
                    };
                }
                return exercise;
            })
        );
    };


    // Save sets to the database when the user clicks "End Workout"
    const handleEndWorkout = async () => {
        try {
            // Send selected exercises (with sets) to the backend API
            const response = await fetch('/api/workout/saveWorkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ exercises: selectedExercises, workoutId: id }),
            });

            if (!response.ok) {
                throw new Error('Failed to save workout.');
            }

            // Clear localStorage and state after saving
            localStorage.removeItem('selectedExercises');
            localStorage.removeItem("workoutStartTime")
            setSelectedExercises([]);
            alert('Workout saved successfully!');
            await router.push('/');
        } catch (error) {
            console.error('Error saving workout:', error);
            alert('Failed to save workout. Please try again.');
        }
    };

    return (
        <div>
            <div className="text-center bg-black text-white py-5 flex pl-7">
                <div className="flex-1">
                    <h1 className="text-2xl"> Workout Tracker </h1>
                    <WorkoutTimer/>
                </div>
                <button
                    onClick={handleEndWorkout}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded max-h-14"
                >
                    End Workout
                </button>
            </div>
            <AlertDialog open={!!celebrationMessage} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl flex gap-2">
                            🎉 Hey you improved! 🎉
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-lg">
                            {celebrationMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel asChild>
                        <button
                            className="inline-flex h-[35px] items-center justify-center rounded bg-mauve4 px-[15px] font-medium leading-none text-mauve11 outline-none outline-offset-1 hover:bg-mauve5 focus-visible:outline-2 focus-visible:outline-mauve7 select-none"
                            onClick={() => setCelebrationMessage('')}>
                            Sehr gut!
                        </button>
                    </AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>


            {/* Display Selected Exercises */}
            <div className="p-4">
                {selectedExercises.map((exercise) => (
                    <div key={exercise.id} className="border p-4 rounded-lg shadow-sm mb-4">
                        <div className="flex">
                            {exercise.image_url && (
                                <img
                                    src={exercise.image_url}
                                    alt={exercise.description}
                                    className="mt-2 w-28 h-28 object-cover rounded"
                                />
                            )}
                            <div>
                                <h2 className="text-xl font-semibold">{exercise.description}</h2>
                                <a href={`../exercise/${exercise.id}`}><p>more information</p></a>
                                <PauseTimer startPause={Pause} setStartPause={setPause} />
                            </div>
                            <div className="ml-auto">
                                <button
                                    onClick={() =>
                                        setSelectedExercises((prev) =>
                                            prev.filter((ex) => ex.id !== exercise.id)
                                        )
                                    }
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        {/* Form to Add Sets */}
                        <div className="mt-4">
                            {/* Display Set Number in the Form Title */}
                            <h3 className="text-lg font-semibold">
                                Add Set {exercise.sets ? exercise.sets.length + 1 : 1}
                            </h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const reps = parseInt(formData.get('reps') as string, 10);
                                    const weight = parseFloat(formData.get('weight') as string);
                                    const notes = formData.get('notes') as string;
                                    const rir = parseInt(formData.get('rir') as string, 10);
                                    const type = selectedValue;
                                    handleAddSet(exercise.id, reps, weight, notes, rir, type);
                                    e.currentTarget.reset(); // Reset the form
                                }}
                            >
                                <div className="flex flex-col gap-4">
                                    {/* Form Inputs and Buttons */}
                                    <div className="flex gap-4">
                                        <input
                                            type="number"
                                            name="reps"
                                            placeholder="Reps"
                                            className="border p-2 rounded"
                                            min={0}
                                            required
                                        />
                                        <input
                                            type="number"
                                            name="weight"
                                            placeholder="Weight (kg)"
                                            className="border p-2 rounded"
                                            min={0}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="notes"
                                            placeholder="Notes"
                                            className="border p-2 rounded flex-1"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            Add Set
                                        </button>
                                    </div>
                                </div>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Advanced Settings</AccordionTrigger>
                                        <AccordionContent className="flex">
                                            <div>
                                                <label htmlFor="rir">RIR</label>
                                                <input
                                                    type="number"
                                                    name="rir"
                                                    placeholder="Reps in reserve"
                                                    className="ml-5 border p-2 rounded"
                                                    min={0}
                                                />
                                                <br />
                                                <label>Type of set</label>
                                                <Select onValueChange={(value) => setSelectedValue(value)}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Normal" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="warmup" className="hover:cursor-pointer">Warmup</SelectItem>
                                                        <SelectItem value="normal" className="hover:cursor-pointer">Normal</SelectItem>
                                                        <SelectItem value="dropset" className="hover:cursor-pointer">Dropset</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="border-gray-300 border-2 ml-5 h-[150px]"></div>
                                            <Tabs defaultValue="account" className="w-[400px] ml-10">
                                                <TabsList>
                                                    <TabsTrigger value="account">Friends</TabsTrigger>
                                                    <TabsTrigger value="password">Last 3 trainings</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="account">Compare against your friends here<br></br>
                                                    <FriendsComparisation exerciseId={exercise.id} setNumber={exercise.sets ? exercise.sets.length + 1 : 1}/>
                                                </TabsContent>
                                                <TabsContent value="password">Compare against your last 3 trainings here<br></br>
                                                    <ExerciseComparison
                                                        exerciseId={exercise.id}
                                                        currentSets={exercise.sets || []} // Pass the current sets
                                                        setNumber = {exercise.sets ? exercise.sets.length + 1 : 1}
                                                    />
                                                </TabsContent>
                                            </Tabs>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </form>
                        </div>

                        {/* Display Sets */}
                        {exercise.sets && exercise.sets.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Sets</h3>
                                <ul>
                                    {exercise.sets.map((set, index) => (
                                        <li key={index} className="border p-2 rounded mb-2 flex gap-5">
                                            <p>Set {index + 1}</p>
                                            <p>Reps: {set.reps}</p>
                                            <p>Weight: {set.weight} kg</p>
                                            {set.notes && <p>Notes: {set.notes}</p>}
                                            {set.rir && <p>RIR: {set.rir}</p>}
                                            {set.type !== 'normal' && <p>Type: {set.type}</p>}
                                            <button
                                                onClick={() => handleDeleteSet(exercise.id, index)}
                                                className="ml-auto text-white px-2 rounded"
                                                aria-label="Delete set"
                                            >
                                                <img src="/icons/trash.svg" alt="Delete set" className="w-[20px] h-[20px]" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-center">
                <AddExerciseButton onExerciseSelect={handleExerciseSelect}/>
            </div>
        </div>
    );
}