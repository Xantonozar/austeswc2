import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import PanelMember from '@/models/PanelMember';

export const dynamic = 'force-dynamic';

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

function getSemesterFromDate(date) {
    const d = new Date(date);
    const month = d.getMonth();
    const year = d.getFullYear();
    if (month >= 5 && month <= 10) return `Fall ${year}`;
    if (month === 11) return `Spring ${year + 1}`;
    return `Spring ${year}`;
}

export async function POST(req) {
    try {
        const session = await getPanelSession();
        if (!session || !session.isAdmin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { memberId } = await req.json();
        if (!memberId) {
            return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
        }

        await connectDB();
        const member = await PanelMember.findById(memberId);
        if (!member) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        const currentSemester = getSemesterFromDate(new Date());

        member.status = 'kicked';
        member.semesterLeft = currentSemester;
        member.leftAt = new Date();
        member.leftReason = 'kicked';
        await member.save();

        return NextResponse.json({ success: true, message: `${member.name} has been removed from the club` });
    } catch (error) {
        console.error('Error kicking member:', error);
        return NextResponse.json({ error: 'Failed to kick member' }, { status: 500 });
    }
}
