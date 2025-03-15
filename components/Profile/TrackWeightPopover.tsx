import { useEffect, useState } from "react";

export default function TrackWeightPopover() {
    const [weight, setWeight] = useState<number | "">("");
    const [weights, setWeights] = useState<{ weight: number; recorded_at: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchWeights = async () => {
        try {
            const response = await fetch('/api/user/weight');
            if (!response.ok) throw new Error("Failed to fetch weights");
            const data = await response.json();
            setWeights(data);
        } catch (error) {
            console.error("Error fetching weights:", error);
        }
    };

    useEffect(() => {
        fetchWeights();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!weight) return;

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch('/api/user/weight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weight: Number(weight) })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Weight saved successfully!");
                setWeight("");
                fetchWeights(); // Refresh weight history
            } else {
                setMessage(data.error || "Failed to save weight.");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-semibold">Track Weight</h1>
            <form onSubmit={handleSubmit} className="mt-4">
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                </label>
                <input
                    type="number"
                    min={0}
                    max={500}
                    step={0.1}
                    id="weight"
                    className="mt-2 p-2 border rounded-lg w-full"
                    onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                    value={weight}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                >
                    {loading ? "Saving..." : "Submit"}
                </button>
            </form>
            {message && <p className="mt-2 text-center text-sm">{message}</p>}
            <div className="mt-6">
                <h2 className="text-lg font-semibold">Last Entries</h2>
                <ul className="mt-2 space-y-2">
                    {weights ? ( weights.map(({ weight, recorded_at }, index) => (
                        <li key={index} className="border p-2 rounded">
                            {new Date(recorded_at).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })}: {weight} kg
                        </li>
                    ))) : ( <li>No entries yet</li> )}
                </ul>
            </div>
            <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
                Show all
            </button>
        </div>
    );
}
