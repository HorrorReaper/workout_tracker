"use client";

import React, { useEffect, useState } from "react";
import ExerciseProgressChart from "@/components/workout/ExerciseProgressChart";

export default function Home({ params }) {
    const { id } = React.use(params);
    const [exerciseInfo, setExerciseInfo] = useState(null);
    const [workoutData, setWorkoutData] = useState([]);
    useEffect(() => {
        const getExerciseInfos = async () => {
            try {
                const response = await fetch(`/api/exercise/getExerciseInfos/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ exerciseId: id }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch exercise');
                }

                const data = await response.json();
                console.log("Exercise Data:", data);
                if (data.exercise && data.exercise.length > 0) {
                    setExerciseInfo(data.exercise[0]); // Get the first object in the array
                }
            } catch (err) {
                console.error('Error fetching exercise:', err);
            }
        };

        getExerciseInfos();

    }, [id]); // Fetch when `id` changes

    return (
        <div className="container">

            {exerciseInfo ? (

                <div className="mx-[20vw]">
                    <h1 className="text-2xl font-bold text-center">{exerciseInfo.description}</h1>
                    {exerciseInfo.image_url && (
                        <img
                            src={exerciseInfo.image_url}
                            alt={exerciseInfo.description}
                            className="mt-2 w-auto h-auto object-cover rounded"
                        />
                    )}
                    <div dangerouslySetInnerHTML={{__html: exerciseInfo.beschreibung}}/>

                </div>
            ) : (
                <p>Loading exercise info...</p>
            )}
            <h1 className="text-center text-2xl font-bold">History</h1>
            <ExerciseProgressChart exerciseId={id} />
        </div>
    );
}
