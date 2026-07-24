import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Evolution from '@/models/Evolution';
import { getAdminFromSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const admin = await getAdminFromSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const targetId = searchParams.get('targetId');

        await connectDB();

        if (targetId) {
            const history = await Evolution.find({ targetId })
                .populate('grantorId', 'name role')
                .sort({ createdAt: -1 })
                .lean();

            return NextResponse.json({ history });
        }

        const allHistory = await Evolution.find({})
            .populate('grantorId', 'name role')
            .populate('targetId', 'name role')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ history: allHistory });
    } catch (error) {
        console.error('Error fetching evolution history:', error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
