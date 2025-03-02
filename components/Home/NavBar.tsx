export default function NavBar() {
    return (
        <div className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Workout Tracker</h1>
                <div>
                    <a href="/" className="text-white hover:text-gray-200 px-4">Home</a>
                    <a href="/exercises" className="text-white hover:text-gray-200 px-4">Start Workout</a>
                    <a href="/users" className="text-white hover:text-gray-200 px-4">Friends</a>
                    <a href="/login" className="text-white hover:text-gray-200 px-4">Login</a>
                </div>
            </div>
        </div>
    );
}