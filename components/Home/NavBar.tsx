'use client';
import Link from 'next/link';
import {useEffect, useState} from "react";

export default function NavBar() {
    const [userId, setUserId] = useState<number | null>(0);
    const getUserId = async () => {
        try {
            const response = await fetch('/api/tools/getUserId');
            const data = await response.json();
            setUserId(data.userId);
        }catch (error) {
            console.error('Error getting user ID:', error);
        }
    }
    useEffect(() => {
        getUserId();
    }, []);
    return (
        <div className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Workout Tracker</h1>
                <div>
                    <Link href="/" className="text-white hover:text-gray-200 px-4">Home</Link>
                    <Link href="/exercises" className="text-white hover:text-gray-200 px-4">Start Workout</Link>
                    <Link href="/users" className="text-white hover:text-gray-200 px-4">Friends</Link>
                    <Link href="/login" className="text-white hover:text-gray-200 px-4">Login</Link>
                    <Link href={"/user/" + userId} className="text-white hover:text-gray-200 px-4">Profile</Link>
                </div>
            </div>
        </div>
    );
}