import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Evolution from '@/models/Evolution';
import DataCollect from '@/models/DataCollect';
import { getAdminFromSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const admin = await getAdminFromSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const [admins, pointsData, dcRecords] = await Promise.all([
            Admin.find({}, 'username name email role team createdAt').lean(),
            Evolution.aggregate([
                { $group: { _id: '$targetId', totalPoints: { $sum: '$points' } } },
            ]),
            DataCollect.find(
                {},
                'imageUrl email name'
            ).lean(),
        ]);

        const pointsMap = {};
        pointsData.forEach(p => {
            pointsMap[p._id.toString()] = p.totalPoints;
        });

        const dcMap = {};
        dcRecords.forEach(d => {
            dcMap[d.email?.toLowerCase()] = d.imageUrl || null;
            dcMap[d.name?.toLowerCase()] = d.imageUrl || null;
        });

        const leaderboard = admins.map(a => ({
            _id: a._id.toString(),
            name: a.name,
            role: a.role,
            team: a.team,
            totalPoints: pointsMap[a._id.toString()] || 0,
            imageUrl: dcMap[a.email?.toLowerCase()] || dcMap[a.name?.toLowerCase()] || null,
        })).sort((a, b) => b.totalPoints - a.totalPoints);

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}
