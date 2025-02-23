'use client';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {Exercise} from "@/types";
import SearchExercisePopover from "@/components/workout/searchExercisePopover";
import {useState} from "react";

export default function AddExerciseButton({
                                              onExerciseSelect,
                                          }: {
    onExerciseSelect: (exercise: Exercise) => void;
}) {
    const [open, setOpen] = useState(false);
    const handleExerciseSelect = (exercise: Exercise) => {
        onExerciseSelect(exercise); // ✅ Add the exercise to the workout
        setOpen(false); // ✅ Close the popover
    };
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className="rounded-2xl py-2 px-5 bg-blue-400 text-white hover:bg-blue-600"
                    onClick={() => setOpen((prev) => !prev)}
                >
                    Add Exercise
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 max-h-[400px] overflow-y-auto">
                {/* ✅ Pass setOpen to close the popover */}
                <SearchExercisePopover onExerciseSelect={handleExerciseSelect} />
            </PopoverContent>
        </Popover>
    );
}