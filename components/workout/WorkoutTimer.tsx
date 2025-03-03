import { useEffect, useState } from "react";

export default function WorkoutTimer() {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        // Check if start time exists in localStorage
        let startTime = localStorage.getItem("workoutStartTime");

        if (!startTime) {
            // If no start time, set it to current timestamp
            startTime = new Date().getTime().toString();
            localStorage.setItem("workoutStartTime", startTime);
        }

        // Convert startTime from localStorage to number
        const startTimestamp = parseInt(startTime, 10);

        // Function to update the elapsed time
        const updateElapsedTime = () => {
            const now = new Date().getTime();
            setElapsedTime(now - startTimestamp);
        };

        // Start the interval to update elapsed time every second
        const interval = setInterval(updateElapsedTime, 1000);
        updateElapsedTime(); // Call it immediately to avoid delay

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Convert elapsed milliseconds to hh:mm:ss format
    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col  p-4  rounded-lg shadow-md w-">
            <p className="text-2xl font-mono text-blue-600 mt-2">{formatTime(elapsedTime)}</p>
        </div>
    );
}
