import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { getAdminFromSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
    try {
        const admin = await getAdminFromSession();
        if (!admin || admin.role !== 'superadmin') {
            return NextResponse.json({ error: 'Only superadmin can update admins' }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        await connectDB();

        const updateData = {};
        if (body.name) updateData.name = body.name;
        if (body.email) updateData.email = body.email.toLowerCase();
        if (body.role) updateData.role = body.role;
        if (body.password) {
            const bcrypt = await import('bcryptjs');
            updateData.password = await bcrypt.hash(body.password, 12);
        }

        const updated = await Admin.findByIdAndUpdate(id, updateData, { new: true }).select('username name email role');
        if (!updated) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, admin: updated });
    } catch (error) {
        console.error('Error updating admin:', error);
        return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const admin = await getAdminFromSession();
        if (!admin || admin.role !== 'superadmin') {
            return NextResponse.json({ error: 'Only superadmin can delete admins' }, { status: 403 });
        }

        const { id } = await params;

        await connectDB();

        if (id === admin.id) {
            return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
        }

        const deleted = await Admin.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting admin:', error);
        return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
    }
}
