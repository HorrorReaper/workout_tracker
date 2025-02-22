'use client'; // Mark this as a Client Component

import { useEffect, useState } from 'react';

export default function WorkoutTimer() {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Load saved timer state from local storage
    useEffect(() => {
        const savedStartTime = localStorage.getItem('workoutStartTime');
        const savedElapsedTime = localStorage.getItem('workoutElapsedTime');

        if (savedStartTime) {
            const startTime = parseInt(savedStartTime, 10);
            const currentTime = Date.now();
            const elapsed = savedElapsedTime ? parseInt(savedElapsedTime, 10) : 0;
            setElapsedTime(elapsed + (currentTime - startTime));
            setIsRunning(true);
        }
    }, []);

    // Start the timer
    const startTimer = () => {
        const startTime = Date.now();
        localStorage.setItem('workoutStartTime', startTime.toString());
        setIsRunning(true);
    };

    // Stop the timer
    const stopTimer = () => {
        localStorage.removeItem('workoutStartTime');
        localStorage.setItem('workoutElapsedTime', elapsedTime.toString());
        setIsRunning(false);
    };

    // Reset the timer
    const resetTimer = () => {
        localStorage.removeItem('workoutStartTime');
        localStorage.removeItem('workoutElapsedTime');
        setElapsedTime(0);
        setIsRunning(false);
    };

    // Update the elapsed time every second
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning) {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1000);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    // Format the elapsed time (HH:MM:SS)
    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        const seconds = Math.floor((time % 60000) / 1000);

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
            {!isRunning ? (
                <button onClick={startTimer} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Start
                </button>
            ) : (
                <button onClick={stopTimer} className="bg-red-500 text-white px-4 py-2 rounded">
                    Stop
                </button>
            )}
            <button onClick={resetTimer} className="bg-gray-500 text-white px-4 py-2 rounded">
                Reset
            </button>
        </div>
    );
}