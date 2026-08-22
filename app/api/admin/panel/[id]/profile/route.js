import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import DataCollect from '@/models/DataCollect';
import { getAdminFromSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
    try {
        const admin = await getAdminFromSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        if (admin.id !== id && admin.role !== 'superadmin') {
            return NextResponse.json({ error: 'You can only edit your own profile' }, { status: 403 });
        }

        const body = await req.json();
        await connectDB();

        const target = await Admin.findById(id, 'name email').lean();
        if (!target) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        const adminUpdates = {};
        if (body.name && body.name !== target.name) adminUpdates.name = body.name.trim();
        if (body.email && body.email.toLowerCase() !== target.email) {
            const emailTaken = await Admin.findOne({ email: body.email.toLowerCase(), _id: { $ne: id } });
            if (emailTaken) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
            }
            adminUpdates.email = body.email.toLowerCase();
        }

        if (Object.keys(adminUpdates).length > 0) {
            await Admin.findByIdAndUpdate(id, adminUpdates);
        }

        const dcRecord = await DataCollect.findOne({
            $or: [{ email: target.email }, { name: target.name }],
        });

        if (dcRecord) {
            const dcUpdates = {};
            if (body.name) dcUpdates.name = body.name.trim();
            if (body.email) dcUpdates.email = body.email.toLowerCase();
            if (body.phone !== undefined) dcUpdates.phone = body.phone;
            if (body.department !== undefined) dcUpdates.department = body.department;
            if (body.studentId !== undefined) dcUpdates.studentId = body.studentId.toUpperCase();
            if (body.yearSemester !== undefined) dcUpdates.yearSemester = body.yearSemester;
            if (body.labGroup !== undefined) dcUpdates.labGroup = body.labGroup;
            await DataCollect.findByIdAndUpdate(dcRecord._id, dcUpdates);
        }

        const updated = await Admin.findById(id, 'username name email role team createdAt').lean();

        return NextResponse.json({ success: true, profile: updated });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
