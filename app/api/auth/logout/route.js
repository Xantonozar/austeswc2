import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req) {
    // Clear session cookie
    const cookie = serialize('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
    });

    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', cookie);

    return response;
}
