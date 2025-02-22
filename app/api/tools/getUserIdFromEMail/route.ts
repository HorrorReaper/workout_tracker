import {NextResponse} from "next/server";
import pool from "@/lib/db";
import {cookies} from "next/headers";

export async function POST(request: Request) {
    const { email } = await request.json();
    console.log('email:', email);
    try {
        // pool.execute returns [rows, fields]
        const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
        // rows is an array of objects, e.g. [{ id: 123 }]
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (!rows || rows.length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        // Return the numeric userId
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const user = rows[0];
        (await cookies()).set('userId', user.id, {secure: true, sameSite: 'strict'});
        return NextResponse.json({ userId: user.id });
    } catch (e) {
        return NextResponse.json({ message: `Internal server error: ${e}` }, { status: 500 });
    }
}
