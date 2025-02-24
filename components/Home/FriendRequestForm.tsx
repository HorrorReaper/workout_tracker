'use client';
import { useState, useEffect } from "react";

export default function FriendRequestForm() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{ id: number; name: string; email: string }[]>([]);
    const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/friends/search?query=${searchQuery}`);
                if (!response.ok) throw new Error("Failed to fetch users.");
                const data = await response.json();
                setSearchResults(data);
            } catch (err) {
                setError("Error fetching users." + err);
            }
        };

        fetchUsers();
    }, [searchQuery]);

    const sendFriendRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) {
            setError("Please select a user.");
            return;
        }

        try {
            const response = await fetch("/api/friends/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ friendId: selectedUser.id }),
            });

            if (!response.ok) throw new Error("Failed to send friend request.");
            alert(`Friend request sent to ${selectedUser.name}!`);
            setSelectedUser(null);
            setSearchQuery("");
            setSearchResults([]);
        } catch (err) {
            setError( err);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-2">Add a Friend</h2>
            <form onSubmit={sendFriendRequest}>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border rounded"
                />

                {/* Dropdown for search results */}
                {searchResults.length > 0 && (
                    <ul className="mt-2 border rounded bg-white shadow-md">
                        {searchResults.map((user) => (
                            <li
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {user.name} ({user.email})
                            </li>
                        ))}
                    </ul>
                )}

                {/* Selected user display */}
                {selectedUser && (
                    <p className="mt-2 text-sm text-gray-600">
                        Selected: <strong>{selectedUser.name}</strong>
                    </p>
                )}

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
                    Send Friend Request
                </button>
            </form>
        </div>
    );
}
