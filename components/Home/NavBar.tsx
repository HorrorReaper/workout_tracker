import Link from 'next/link';

            export default function NavBar() {
                return (
                    <div className="bg-gray-800 text-white p-4">
                        <div className="container mx-auto flex justify-between items-center">
                            <h1 className="text-2xl font-bold">Workout Tracker</h1>
                            <div>
                                <Link href="/" className="text-white hover:text-gray-200 px-4">Home</Link>
                                <Link href="/exercises" className="text-white hover:text-gray-200 px-4">Start Workout</Link>
                                <Link href="/users" className="text-white hover:text-gray-200 px-4">Friends</Link>
                                <Link href="/login" className="text-white hover:text-gray-200 px-4">Login</Link>
                                <Link href="/profile" className="text-white hover:text-gray-200 px-4">Profile</Link>
                            </div>
                        </div>
                    </div>
                );
            }