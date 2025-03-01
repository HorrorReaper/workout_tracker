'use client';
import React, {useEffect, useState} from "react";

export default function UserPage({params}){
    const { id } = React.use(params);
    const [userName, setUserName] = useState<string>('');
    const [userCreatedAt, setUserCreatedAt] = useState<string>('');
    const [userProfilePicture, setUserProfilePicture] = useState<string>('');
    const [lastWorkouts, setLastWorkouts] = useState<any[]>([]);
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
            console.log('User details:', data);

        }catch (error) {
            console.error('Error getting user details:', error);
        }
    }
    useEffect(() => {
       getUserDetails();
    }, []);
    return(
        <div>
            <h1 className="text-2xl font-bold ">User Details</h1>
            <img src={userProfilePicture} alt="Profile Picture" className="w-32 h-32 rounded-full mt-4"/>
            <p className="text-xl  mt-2">User Name: {userName}</p>
            <p className="text-xl  mt-2">Dabei seit: {new Date(userCreatedAt).toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',

            })}</p>
            <h2 className="text-xl font-bold mt-4">Last Workouts</h2>
            <ul>
                {lastWorkouts.map((workout) => (
                    <li key={workout.id} className="mt-2">
                        <p className="text-lg font-bold">{new Date(workout.started_at).toLocaleString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })}</p>
                        <p className="text-lg">{workout.name}</p>

                    </li>
                ))}
            </ul>

        </div>
    )
}