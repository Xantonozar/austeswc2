import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Evolution from '@/models/Evolution';
import DataCollect from '@/models/DataCollect';
import { getAdminFromSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    try {
        const admin = await getAdminFromSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const target = await Admin.findById(id, 'username name email role team createdAt').lean();
        if (!target) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        const [pointsData, evolutions, rankData, dcRecord] = await Promise.all([
            Evolution.aggregate([
                { $match: { targetId: target._id } },
                { $group: { _id: null, totalPoints: { $sum: '$points' } } },
            ]),
            Evolution.find({ targetId: target._id })
                .populate('grantorId', 'name role')
                .sort({ createdAt: -1 })
                .lean(),
            Evolution.aggregate([
                { $group: { _id: '$targetId', totalPoints: { $sum: '$points' } } },
                { $sort: { totalPoints: -1 } },
            ]),
            DataCollect.findOne(
                { $or: [{ email: target.email }, { name: target.name }] },
                'imageUrl department studentId phone yearSemester labGroup'
            ).lean(),
        ]);

        const totalPoints = pointsData[0]?.totalPoints || 0;
        const rank = rankData.findIndex(r => r._id.toString() === target._id.toString()) + 1;

        return NextResponse.json({
            profile: {
                ...target,
                imageUrl: dcRecord?.imageUrl || null,
                department: dcRecord?.department || null,
                studentId: dcRecord?.studentId || null,
                phone: dcRecord?.phone || null,
                yearSemester: dcRecord?.yearSemester || null,
                labGroup: dcRecord?.labGroup || null,
                totalPoints,
                rank: rank || rankData.length + 1,
                evolutionCount: evolutions.length,
                positiveCount: evolutions.filter(e => e.points > 0).length,
                negativeCount: evolutions.filter(e => e.points < 0).length,
            },
            evolutions,
        });
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

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
        if (body.team !== undefined) updateData.team = body.team;
        if (body.password) {
            const bcrypt = await import('bcryptjs');
            updateData.password = await bcrypt.hash(body.password, 12);
        }

        const updated = await Admin.findByIdAndUpdate(id, updateData, { new: true }).select('username name email role team');
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
