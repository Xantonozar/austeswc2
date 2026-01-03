import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        // Check credentials against environment variables
        const validUsername = process.env.ADMIN_USERNAME || 'admin';
        const validPassword = process.env.ADMIN_PASSWORD;

        if (!validPassword) {
            return NextResponse.json(
                { error: 'Admin password not configured' },
                { status: 500 }
            );
        }

        if (username === validUsername && password === validPassword) {
            // Create session cookie
            const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');

            const cookie = serialize('admin_session', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            const response = NextResponse.json({ success: true });
            response.headers.set('Set-Cookie', cookie);

            return response;
        } else {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
