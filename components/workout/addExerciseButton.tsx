'use client';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {Exercise} from "@/types";
import SearchExercisePopover from "@/components/workout/searchExercisePopover";

export default function AddExerciseButton({
                                              onExerciseSelect,
                                          }: {
    onExerciseSelect: (exercise: Exercise) => void;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="rounded-2xl py-2 px-5 bg-blue-400 text-white hover:bg-blue-600">
                    Add Exercise
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 max-h-[400px] overflow-y-auto">
                <SearchExercisePopover onExerciseSelect={onExerciseSelect} />
            </PopoverContent>
        </Popover>
    );
}