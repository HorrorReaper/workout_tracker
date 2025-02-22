// components/workout/ExerciseComparison.tsx
'use client';
import { useEffect, useState } from 'react';


type Set = {
    reps: number;
    weight: number;
    notes: string;
    rir: number;
    type: string;
};

type ExerciseComparisonProps = {
    exerciseId: number;
    currentSets: Set[]; // Current sets in the workout
    setNumber: number; // Current set number
};

export default function ExerciseComparison({
                                               exerciseId,
                                               currentSets,
                                                setNumber
                                           }: ExerciseComparisonProps) {
    const [lastSets, setLastSets] = useState<Set[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    console.log('currentSets', currentSets);
    const fetchLastSets = async () => {
        setLoading(true);
        setError('');

        try {
            const anzahl = 3;
            const response = await fetch('/api/workout/getLastSets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exerciseId, anzahl, setNumber }),
            });

            if (!response.ok) throw new Error('Failed to fetch last sets.');
            const data = await response.json();
            setLastSets(data.sets);
        } catch (err) {
            console.error('Error fetching last sets:', err);
            setError('Failed to load last sets.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchLastSets();
    }, [exerciseId]);

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading...</p>}

            {/* Last 3 Sets */}
            {lastSets.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold">Last 3 Sets</h3>
                    <ul>
                        {lastSets.map((set, index) => (
                            <li key={index} className="border p-2 rounded mb-2">
                                {set.reps}x{set.weight}kg
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}