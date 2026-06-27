import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Member from '@/models/Member';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Helper to check authentication
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
        const members = await Member.find({}, 'name studentId email phone department yearSemester labGroup paymentMethod bkashId imageUrl createdAt reference recruitmentSemester')
            .sort({ createdAt: -1 })
            .lean();

        // Add cache control headers
        const response = NextResponse.json({ members });
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;
    } catch (error) {
        console.error('Error fetching members:', error);
        return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
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
            return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
        }

        await connectDB();
        const deletedMember = await Member.findByIdAndDelete(id);

        if (!deletedMember) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Member removed successfully' });

    } catch (error) {
        console.error('Error deleting member:', error);
        return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
    }
}
