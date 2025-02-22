'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {formatDate} from "@/lib/utils";

type Set = {
    date: string;
    weight: number;
    reps: number;
    setNumber: number;  // New field to distinguish sets
};

export default function ExerciseProgressChart({ exerciseId }: { exerciseId: number }) {
    const [chartMode, setChartMode] = useState<'all' | 'heaviest'>('all'); // Default to "All Sets"
    const [chartData, setChartData] = useState<Set[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch Data Based on Chart Mode
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await fetch('/api/workout/history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ exerciseId, mode: chartMode }), // Send mode to API
                });

                if (!response.ok) throw new Error('Failed to fetch workout data.');
                let data = await response.json();
                data = data.map(item => ({
                    ...item,
                    created_at: formatDate(item.created_at) // Format date for chart
                }))
                console.log('Workout data:', data);
                setChartData(data);
            } catch (err) {
                console.error('Error fetching workout data:', err);
                setError('Failed to load workout data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [exerciseId, chartMode]); // Fetch data when mode changes

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-bold mb-2">Exercise Progress</h2>

            {/* Dropdown to switch chart modes */}
            <select
                value={chartMode}
                onChange={(e) => setChartMode(e.target.value as 'all' | 'heaviest')}
                className="mb-4 p-2 border rounded"
            >
                <option value="all">Show All Sets</option>
                <option value="heaviest">Show Heaviest Set</option>
            </select>

            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading...</p>}

            {/* Line Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="created_at" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {chartMode === 'all' ? (
                        <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                    ) : (
                        <Line type="monotone" dataKey="weight" stroke="#82ca9d" />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
