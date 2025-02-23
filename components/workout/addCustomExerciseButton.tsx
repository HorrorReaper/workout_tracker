'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import AddCustomExercise from "@/components/workout/AddCustomExercise";

export default function AddCustomExerciseButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* Button to open the dialog */}
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white hover:bg-blue-700">
                    Add Custom Exercise
                </Button>
            </DialogTrigger>

            {/* Dialog Content (Contains the form) */}
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <h2 className="text-lg font-bold">Create a Custom Exercise</h2>
                </DialogHeader>
                <AddCustomExercise/>
            </DialogContent>
        </Dialog>
    );
}
