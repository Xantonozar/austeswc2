import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Evolution from '@/models/Evolution';
import { canManage, hasPanelAccess } from '@/lib/roles';
import { getAdminFromSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const admin = await getAdminFromSession();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { targetId, points, reason } = await req.json();

        if (!targetId || points === undefined || !reason) {
            return NextResponse.json({ error: 'targetId, points, and reason are required' }, { status: 400 });
        }

        if (typeof points !== 'number' || points === 0) {
            return NextResponse.json({ error: 'Points must be a non-zero number' }, { status: 400 });
        }

        await connectDB();

        const Admin = (await import('@/models/Admin')).default;
        const target = await Admin.findById(targetId).lean();
        if (!target) {
            return NextResponse.json({ error: 'Target not found' }, { status: 404 });
        }

        if (!hasPanelAccess(admin.role) || !canManage(admin.role, target.role)) {
            return NextResponse.json({ error: 'You do not have permission to evolve members' }, { status: 403 });
        }

        const evolution = await Evolution.create({
            targetId,
            grantorId: admin.id,
            points,
            reason,
        });

        return NextResponse.json({ success: true, evolution });
    } catch (error) {
        console.error('Error creating evolution:', error);
        return NextResponse.json({ error: 'Failed to create evolution' }, { status: 500 });
    }
}
