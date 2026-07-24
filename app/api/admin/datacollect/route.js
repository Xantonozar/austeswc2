import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DataCollect from '@/models/DataCollect';
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
        const records = await DataCollect.find({}, 'name email phone department yearSemester labGroup team position studentId imageUrl routineImageUrl createdAt')
            .sort({ createdAt: -1 })
            .lean();

        const response = NextResponse.json({ records });
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;
    } catch (error) {
        console.error('DataCollect GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        if (!await isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Record ID required' }, { status: 400 });
        }

        await connectDB();
        const deleted = await DataCollect.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Record deleted' });
    } catch (error) {
        console.error('DataCollect DELETE Error:', error);
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
    }
}
