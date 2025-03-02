'use client';
import React, {useEffect, useState} from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function UserPage({params}){
    const { id } = React.use(params);
    const [userName, setUserName] = useState<string>('');
    const [userCreatedAt, setUserCreatedAt] = useState<string>('');
    const [userProfilePicture, setUserProfilePicture] = useState<string>('');
    const [lastWorkouts, setLastWorkouts] = useState<any[]>([]);
    const [currentMaxes, setCurrentMaxes] = useState<any[]>([]);
    const getUserDetails = async () => {
        try{
            const response = await fetch(`/api/user/getUserDetails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                }),
            });
            const data = await response.json();
            setUserName(data.user[0].name);
            setUserCreatedAt(data.user[0].created_at);
            setUserProfilePicture(data.user[0].profile_picture_url);
            setLastWorkouts(data.lastWorkouts);
            setCurrentMaxes(data.maxWeights);
            console.log('User details:', data);

        }catch (error) {
            console.error('Error getting user details:', error);
        }
    }
    useEffect(() => {
       getUserDetails();
    }, []);
    return(
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
            {/* Profile Section */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
                <img src={userProfilePicture}
                     alt="Profile Picture"
                     className="w-32 h-32 rounded-full mt-4 border-4 border-blue-500 shadow-md mx-auto" />
                <p className="text-xl text-gray-700 mt-3 font-semibold">{userName}</p>
                <p className="text-md text-gray-500 mt-1">
                    👤 Member Since: {new Date(userCreatedAt).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                })}
                </p>
            </div>
            <Tabs defaultValue="account" >
                <TabsList className={"flex justify-center mt-6 bg-white"}>
                    <TabsTrigger value="lastWorkouts">Last Workouts</TabsTrigger>
                    <TabsTrigger value="currentMaxes">current Maxes</TabsTrigger>
                </TabsList>
                <TabsContent value="lastWorkouts">
                    {/* Last Workouts Section */}
                    <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-4 border-b pb-2">{userName}&#39;s Last Workouts</h2>

                    {lastWorkouts && lastWorkouts.length > 0 ? (
                        <ul className="space-y-6">
                            {lastWorkouts.map((workout) => (
                                <li key={workout.workout_id}
                                    className="bg-gray-100 p-5 rounded-lg shadow-md hover:shadow-lg transition-all">

                                    {/* Workout Title & Date */}
                                    <div className="mb-3">
                                        <h3 className="text-lg font-bold text-gray-900">{workout.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            📅 {new Date(workout.started_at).toLocaleDateString('de-DE', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}

                                        </p>
                                    </div>

                                    {/* Group Sets by Exercise */}
                                    {workout.sets && workout.sets.length > 0 ? (
                                        <ul className="space-y-4">
                                            {Object.values(
                                                workout.sets.reduce((groupedSets, set) => {
                                                    if (!groupedSets[set.exercise_id]) {
                                                        groupedSets[set.exercise_id] = {
                                                            exercise_name: set.exercise_name,
                                                            sets: [],
                                                        };
                                                    }
                                                    groupedSets[set.exercise_id].sets.push(set);
                                                    return groupedSets;
                                                }, {})
                                            ).map(({ exercise_name, sets }) => (
                                                <li key={sets[0].exercise_id}
                                                    className="border-l-4 border-blue-500 pl-4">

                                                    {/* Exercise Name */}
                                                    <h4 className="font-semibold text-blue-700 text-md">{exercise_name}</h4>

                                                    {/* Sets List */}
                                                    <ul className="text-sm text-gray-700 space-y-1 mt-1">
                                                        {sets.map((set) => (
                                                            <li key={`${workout.workout_id}-${set.set_number}`}
                                                                className="flex justify-between bg-white p-2 rounded-md shadow-sm">

                                                <span className="font-medium">
                                                    Set {set.set_number}: {set.reps} reps, {set.weight} kg
                                                </span>
                                                                <span className="text-gray-500">
                                                    {set.notes && <span className="italic mr-2">{set.notes}</span>}
                                                                    {set.RIR !== null && set.RIR !== undefined && (
                                                                        <span className="text-gray-600"> (RIR: {set.RIR})</span>
                                                                    )}
                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500">No sets logged for this workout.</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No workouts yet.</p>
                    )}
                </TabsContent>
                <TabsContent value="currentMaxes">
                    <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-4 border-b pb-2">{userName}&#39;s current Maxes</h2>
                    {currentMaxes && currentMaxes.length > 0 ? (
                        <ul className="space-y-4">
                            {currentMaxes.map((max) => (
                                <li key={max.description}
                                    className="bg-gray-100 p-5 rounded-lg shadow-md hover:shadow-lg transition-all">
                                    <h3 className="text-lg font-bold text-gray-900">{max.description}</h3>
                                    <p className="text-sm text-gray-600">🏋️‍♂️ {max.max_weight} kg</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No maxes logged yet.</p>
                    )}
                </TabsContent>
            </Tabs>

        </div>

    )
}