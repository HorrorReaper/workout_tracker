'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function FriendRequests({ userId }: { userId: number }) {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            console.log('Fetching requests for user:', userId);
            const response = await fetch('/api/friends/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();
            console.log('Friend requests:', data);
            setRequests(data.friendRequests || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async (requestId: number, accept: boolean) => {
        try {
            const response = await fetch('/api/friends/respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, accept }),
            });

            if (!response.ok) throw new Error('Failed to update request');
            fetchRequests(); // Refresh the list
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [userId]);

    if (loading) return <div>Loading requests...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Friend Requests</h2>
            {requests.length === 0 ? (
                <p className="text-gray-500">No pending requests</p>
            ) : (
                <ul className="space-y-3">
                    {requests.map((request) => (
                        <li
                            key={request.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                        >
                            <div>
                                <h1>Hallo, hier ist eine Friend-Request, die nicht angezeigt wird :(</h1>
                                <p className="font-medium">{request.name}</p>
                                <p className="text-sm text-gray-500">{request.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleResponse(request.id, true)}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    Accept
                                </Button>
                                <Button
                                    onClick={() => handleResponse(request.id, false)}
                                    variant="destructive"
                                >
                                    Decline
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}