import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Evolution from '@/models/Evolution';
import bcrypt from 'bcryptjs';
import { getAdminFromSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const admin = await getAdminFromSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const admins = await Admin.find({}, 'username name email role createdAt')
            .sort({ createdAt: -1 })
            .lean();

        const pointsData = await Evolution.aggregate([
            {
                $group: {
                    _id: '$targetId',
                    totalPoints: { $sum: '$points' },
                },
            },
        ]);

        const pointsMap = {};
        pointsData.forEach(p => {
            pointsMap[p._id.toString()] = p.totalPoints;
        });

        const adminsWithPoints = admins.map(a => ({
            ...a,
            totalPoints: pointsMap[a._id.toString()] || 0,
        }));

        return NextResponse.json({ admins: adminsWithPoints });
    } catch (error) {
        console.error('Error fetching admins:', error);
        return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const admin = await getAdminFromSession();
        if (!admin || admin.role !== 'superadmin') {
            return NextResponse.json({ error: 'Only superadmin can create admins' }, { status: 403 });
        }

        const { username, password, name, email, role } = await req.json();

        if (!username || !password || !name || !email || !role) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        await connectDB();

        const existing = await Admin.findOne({ $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }] });
        if (existing) {
            return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newAdmin = await Admin.create({
            username: username.toLowerCase(),
            password: hashedPassword,
            name,
            email: email.toLowerCase(),
            role,
        });

        return NextResponse.json({ success: true, admin: { id: newAdmin._id, username: newAdmin.username, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role } });
    } catch (error) {
        console.error('Error creating admin:', error);
        return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
    }
}
