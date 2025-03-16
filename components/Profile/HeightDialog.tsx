import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React from "react";
export default function HeightDialog() {
    const [height, setHeight] = React.useState<number | "">("");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!height) return;
        const response = await fetch('/api/user/height', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ height: Number(height) })
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Failed to save height:", data.error);
            return;
        }
        setHeight("");
        console.log("Height saved successfully!");

    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <img src="/icons/edit.svg" className="ml-3 w-5 hover:cursor-pointer"/>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Height</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold p-2">Height</h2>
                        <input type="number"  step={1} value={height} min={0} max={300}  className=" p-2 border rounded-lg w-full" onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : "")}/>
                    </div>
                </DialogDescription>
                <DialogFooter>
                    <button className="text-blue-500" onClick={handleSubmit}>Save</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
}