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

export async function PATCH(req, { params }) {
    try {
        if (!await isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = (await params).id;
        const { status } = await req.json();

        if (!status || !['Pending', 'Accepted', 'Rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        await connectDB();
        const application = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, application });
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        if (!await isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = (await params).id;

        await connectDB();
        const application = await Application.findByIdAndDelete(id);

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
    }
}
