'use client';
import CreateWorkoutForm from "@/components/CreateWorkoutForm";
import { useState, useEffect } from "react"; // Add useEffect
import FriendRequests from "@/components/FriendRequests";
import {useRouter, useSearchParams} from 'next/navigation';
import FriendRequestForm from "@/components/Home/FriendRequestForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function Home() {
    //const searchParams = useSearchParams();
    //const email = searchParams.get('email');
    const [friendId, setFriendId] = useState<number>(0);
    const [userId, setUserId] = useState<number>(0);
    const [friends, setFriends] = useState<any[]>([]);
    const [activeWorkouts, setActiveWorkouts] = useState<any[]>([]);
    const [lastWorkouts, setLastWorkouts] = useState<any[]>([]);
    const router = useRouter();

    // Add useEffect to handle the API call
    /*useEffect(() => {
        if (!email) return;
        const getUserId = async () => {
            try {
                const response = await fetch('/api/tools/getUserIdFromEMail', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                if (!response.ok) throw new Error('Failed to get user ID.');
                const data = await response.json();
                setUserId(data.userId);
                console.log('User ID:', data.userId);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        getUserId();
    }, [email]); // Add email as dependency*/
    useEffect(() => {
        const getUserId = async () => {
            try {
                const response = await fetch('/api/tools/getUserId', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error('Failed to get user ID.');
                const data = await response.json();
                setUserId(data.userId);
                console.log('User ID:', data.userId);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        getUserId();
    }, []);

    const sendFriendRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/friends/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, friendId }),
            });

            if (!response.ok) throw new Error('Failed to send friend request.');
            alert('Friend request sent!');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send friend request.');
        }
    };
    const getFriends = async () => {
        try {
            const response = await fetch('/api/friends/list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) throw new Error('Failed to get friends.');
            const data = await response.json();
            console.log('Friends:', data);
            return data.friends;
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const getActiveWorkouts = async () => {
        try {
            const response = await fetch('/api/workout/getActiveWorkouts', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to get active workouts.');
            const data = await response.json();
            console.log('Active workouts:', data.workouts);
            setActiveWorkouts(data.workouts);
            return data;
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const getLastWorkouts = async () => {
        try {
            const response = await fetch('/api/workout/getLastWorkouts', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to get last workouts.');
            const data = await response.json();
            setLastWorkouts(data.workouts);
            console.log('Last workouts:', data.workouts);
            return data;
        } catch (error) {
            console.error('Error:', error);
        }
    }
    useEffect(() => {
        if (!userId) return;
        getFriends().then((friends) => setFriends(friends));
        getActiveWorkouts();
        getLastWorkouts();
    }, [userId]);

    return (
        <div className="container mx-auto max-w-3xl p-6">
            {/* Friend Requests Section */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <FriendRequests userId={userId} />
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6 mb-6">
                <h1 className="text-2xl font-bold">Welcome, {userId}!</h1>
                <p className="text-lg">You have successfully logged in.</p>
            </div>

            {/* Active Workouts or Create New Workout */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                {activeWorkouts.length === 0 ? (
                    <CreateWorkoutForm userId={userId} />
                ) : (
                    <div>
                        <h2 className="text-xl font-semibold mb-3">Active Workouts</h2>
                        <ul className="divide-y divide-gray-200">
                            {activeWorkouts.map((workout) => (
                                <li
                                    key={workout.id}
                                    onClick={() => router.push(`/workout/${workout.id}`)}
                                    className="p-3 cursor-pointer hover:bg-gray-100 rounded-lg transition"
                                >
                                    {workout.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Add Friend Section */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <h2 className="text-xl font-semibold mb-3">Add a Friend</h2>
                <FriendRequestForm />
            </div>

            {/* Friends List */}
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-3">Your Friends</h2>
                {friends.length === 0 ? (
                    <p className="text-gray-500">No friends yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {friends.map((friend) => (
                            <li key={friend.id} className="p-3 flex gap-2 align-middle hover:cursor-pointer" onClick={() => router.push(`/user/${friend.id}`)}><Avatar>
                                <AvatarImage src={friend.profile_picture_url} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar><p className="mt-2">{friend.name}</p></li>
                        ))}
                    </ul>
                )}
            </div>
            {/* Friends List */}
            <div className="bg-white shadow-lg rounded-xl p-6 mt-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Last Workouts</h2>

                {lastWorkouts && lastWorkouts.length > 0 ? (
                    <ul className="space-y-6">
                        {lastWorkouts.map((workout) => (
                            <li key={workout.workout_id} className="bg-gray-100 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                {/* Workout Title & Date */}
                                <div className="mb-3">
                                    <h3 className="text-lg font-bold text-gray-900">{workout.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        🕒 {new Date(workout.started_at).toLocaleString('de-DE', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hourCycle: 'h23',
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
                                                        exercise_name: set.exercise_name, // Store exercise name only once
                                                        sets: [],
                                                    };
                                                }
                                                groupedSets[set.exercise_id].sets.push(set);
                                                return groupedSets;
                                            }, {})
                                        ).map(({ exercise_name, sets }) => (
                                            <li key={sets[0].exercise_id} className="border-l-4 border-blue-500 pl-4">
                                                {/* Exercise Name */}
                                                <h4 className="font-semibold text-blue-700 text-md">{exercise_name}</h4>

                                                {/* Sets List */}
                                                <ul className="text-sm text-gray-700 space-y-1 mt-1">
                                                    {sets.map((set) => (
                                                        <li key={`${workout.workout_id}-${set.set_number}`} className="flex justify-between bg-white p-2 rounded-md shadow-sm">
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
            </div>



        </div>

    );
}