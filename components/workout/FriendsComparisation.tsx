'use client';
import { useEffect, useState } from 'react';

type Set = {
    name: string;
    reps: number;
    weight: number;
    notes: string;
    rir: number;
    type: string;
}
export default function FriendsComparisation({exerciseId, setNumber}: {exerciseId: number, setNumber : number}) {
    const [lastSetsFromFriends, setLastSetsFromFriends] = useState<Set[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fetchLastSetsFromFriends = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/workout/getLastSetsFromFriends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exerciseId, setNumber }),
            });

            if (!response.ok) throw new Error('Failed to fetch last sets from friends.');
            const data = await response.json();
            console.log('Sets from friends: ', data);
            setLastSetsFromFriends(data.friends_sets || []);
        } catch (err) {
            console.error('Error fetching last sets from friends:', err);
            setError('Failed to load last sets from friends.');
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchLastSetsFromFriends();
    }, [exerciseId]);
    return(
        <div>
            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading...</p>}

            {/* Last 3 Sets */}
            {lastSetsFromFriends.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold">Last 3 Sets</h3>
                    <ul>
                        {lastSetsFromFriends.map((set, index) => (
                            <li key={index} className="border p-2 rounded mb-2">
                                {set.name} : {set.reps}x{set.weight}kg
                            </li>

                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}