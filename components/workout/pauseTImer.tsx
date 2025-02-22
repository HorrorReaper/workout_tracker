'use client';
import { useState, useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function PauseTimer({ startPause, setStartPause }: { startPause: boolean, setStartPause: (value: boolean) => void }) {
    const [pauseTime, setPauseTime] = useState<number>(60); // Default pause time
    const [remainingTime, setRemainingTime] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [progress, setProgress] = useState(100);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Start the pause timer when `startPause` is triggered
    useEffect(() => {
        if (startPause) {
            setRemainingTime(pauseTime);
            setProgress(100);
        }
    }, [startPause]);

    // Timer countdown logic
    useEffect(() => {
        if (startPause && remainingTime !== null && remainingTime > 0) {
            intervalRef.current = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev !== null) {
                        const newTime = prev - 1;
                        setProgress((newTime / pauseTime) * 100);
                        if (newTime <= 0) {
                            clearInterval(intervalRef.current!);
                            setStartPause(false); // Close the dialog when time is up
                            const audio = new Audio('/sounds/sound.mp3');
                            audio.loop = false;
                            audio.play();
                            return 0;
                        }
                        return newTime;
                    }
                    return prev;
                });
            }, 1000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [startPause, remainingTime, pauseTime]);

    // Handle user setting the pause time
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const time = parseInt(inputValue, 10);
        if (time > 0) {
            setPauseTime(time);
            setInputValue('');
        }
    };

    return (
        <div>
            {/* Form to set pause duration */}
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Pause time (seconds)"
                    className="border p-2 rounded w-40"
                    min={1}
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Set Pause Time
                </button>
            </form>

            {/* Pause Timer Alert Dialog */}
            <AlertDialog open={startPause}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Pause Timer</AlertDialogTitle>
                        <AlertDialogDescription>
                            Time Remaining: {remainingTime} sec
                            <Progress value={progress} max={100} />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel
                        onClick={() => {
                            setStartPause(false);
                            setRemainingTime(null);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600"
                    >
                        End Pause
                    </AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
