import { redirect } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
    const handleLogin = async (email: string) => {
        'use server'; // Mark this function as a Server Action

        // Call the API to check if the email exists
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            // Redirect to the home page if login is successful

            //redirect('/');
            redirect(`/?email=${encodeURIComponent(email)}`);
        } else {
            // Handle error (you can use a toast or error message)
            console.error(data.message || 'Login failed');
        }
    };

    return (
        <div className="container">
            <h1>Login</h1>
            <LoginForm onSubmit={handleLogin} />
        </div>
    );
}