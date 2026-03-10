import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import PanelMember from '@/models/PanelMember';
import bcrypt from 'bcryptjs';

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

// PATCH - Reset a member's password
export async function PATCH(req) {
    try {
        const session = await getPanelSession();
        if (!session || !session.isAdmin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { memberId, newPassword } = await req.json();

        if (!memberId || !newPassword) {
            return NextResponse.json({ error: 'Member ID and new password required' }, { status: 400 });
        }

        await connectDB();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updated = await PanelMember.findByIdAndUpdate(memberId, { password: hashedPassword }, { new: true });

        if (!updated) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
