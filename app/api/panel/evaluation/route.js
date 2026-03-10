import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import PanelMember from '@/models/PanelMember';

async function getPanelSession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('panel_session');
    if (!sessionCookie) return null;
    try {
        return JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    } catch {
        return null;
    }
}

// POST - Submit an evaluation
export async function POST(req) {
    try {
        const session = await getPanelSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { targetId, points, note } = await req.json();

        if (!targetId || points === undefined || !note) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        const evaluation = {
            date: new Date().toISOString().split('T')[0],
            points: parseInt(points, 10),
            note,
            evaluatorId: session.userId,
        };

        const updated = await PanelMember.findByIdAndUpdate(
            targetId,
            {
                $push: { evaluationHistory: { $each: [evaluation], $position: 0 } },
                $inc: { score: parseInt(points, 10) },
            },
            { new: true, select: '-password' }
        );

        if (!updated) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error submitting evaluation:', error);
        return NextResponse.json({ error: 'Failed to submit evaluation' }, { status: 500 });
    }
}
