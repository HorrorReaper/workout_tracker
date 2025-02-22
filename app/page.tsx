'use client';
import CreateWorkoutForm from "@/components/CreateWorkoutForm";
import { useState, useEffect } from "react"; // Add useEffect
import FriendRequests from "@/components/FriendRequests";
import { useSearchParams } from 'next/navigation';

export default function Home() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [friendId, setFriendId] = useState<number>(0);
    const [userId, setUserId] = useState<number>(0);
    const [friends, setFriends] = useState<any[]>([]);

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
    useEffect(() => {
        if (!userId) return;
        getFriends().then((friends) => setFriends(friends));
    }, [userId]);

    return (
        <div className="container">
            <FriendRequests userId={userId} />
            <h1>Welcome to the Home Page! {email}.</h1>
            <p>You have successfully logged in.</p>
            <CreateWorkoutForm userId={userId}/>
            <h2>Friends</h2>
            <form onSubmit={sendFriendRequest}>
                <label htmlFor="userId">User ID of your friend:</label>
                <input
                    type="number"
                    id="userId"
                    name="userId"
                    value={friendId}
                    onChange={(e) => setFriendId(Number(e.target.value))}
                    required
                />
                <button type="submit">Send Friend request</button>
            </form>
            <h2>All your friends:</h2>
            {friends.length === 0 ? ( <p>No friends yet.</p> ) : ( <ul> {friends.map((friend) => ( <li key={friend.id}>{friend.name}</li> ))} </ul> )}
        </div>
    );
}