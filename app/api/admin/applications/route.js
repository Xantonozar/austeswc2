import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function isAuthenticated() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    return !!sessionCookie;
}

export async function GET(req) {
    try {
        if (!await isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const applications = await Application.find({})
            .sort({ createdAt: -1 })
            .lean();

        const response = NextResponse.json({ applications });
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }
}
