import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import {Toaster} from "@/components/ui/sonner";
import NavBar from "@/components/Home/NavBar";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Workout Tracker',
    description: 'Track your workouts with ease',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <NavBar />
        {children}
        <Toaster />
        </body>

        </html>
    );
}