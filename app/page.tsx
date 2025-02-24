'use client';
import CreateWorkoutForm from "@/components/CreateWorkoutForm";
import { useState, useEffect } from "react"; // Add useEffect
import FriendRequests from "@/components/FriendRequests";
import {useRouter, useSearchParams} from 'next/navigation';
import {router} from "next/client";
import FriendRequestForm from "@/components/Home/FriendRequestForm";

export default function Home() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [friendId, setFriendId] = useState<number>(0);
    const [userId, setUserId] = useState<number>(0);
    const [friends, setFriends] = useState<any[]>([]);
    const [activeWorkouts, setActiveWorkouts] = useState<any[]>([]);
    const router = useRouter();

    // Add useEffect to handle the API call
    useEffect(() => {
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
    }, [email]); // Add email as dependency

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
    useEffect(() => {
        if (!userId) return;
        getFriends().then((friends) => setFriends(friends));
        getActiveWorkouts();
    }, [userId]);

    return (
        <div className="container mx-auto max-w-3xl p-6">
            {/* Friend Requests Section */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <FriendRequests userId={userId} />
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6 mb-6">
                <h1 className="text-2xl font-bold">Welcome, {email}!</h1>
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
                            <li key={friend.id} className="p-3">{friend.name}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

    );
}