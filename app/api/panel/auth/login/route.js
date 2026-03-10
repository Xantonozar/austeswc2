import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import PanelMember from '@/models/PanelMember';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { username, password } = await req.json();
        const trimmedUsername = username.toLowerCase().trim();

        // 1. Check env-based panel admin credentials
        const envAdminUsername = (process.env.PANEL_ADMIN_USERNAME || 'admin').toLowerCase();
        const envAdminPassword = process.env.PANEL_ADMIN_PASSWORD;

        if (envAdminPassword && trimmedUsername === envAdminUsername && password === envAdminPassword) {
            const sessionData = JSON.stringify({
                userId: 'env-admin',
                username: envAdminUsername,
                name: 'Admin',
                isAdmin: true,
                loginAt: Date.now(),
            });
            const token = Buffer.from(sessionData).toString('base64');

            const cookieStore = await cookies();
            cookieStore.set('panel_session', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24,
                path: '/',
            });

            return NextResponse.json({
                success: true,
                user: {
                    _id: 'env-admin',
                    name: 'Admin',
                    username: envAdminUsername,
                    designation: 'President',
                    rankLevel: 12,
                    department: null,
                    score: 0,
                    imageUrl: '',
                    evaluationHistory: [],
                    isAdmin: true,
                },
            });
        }

        // 2. Check database panel members
        await connectDB();
        const member = await PanelMember.findOne({ username: trimmedUsername });

        if (!member) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        const sessionData = JSON.stringify({
            userId: member._id.toString(),
            username: member.username,
            name: member.name,
            isAdmin: false,
            loginAt: Date.now(),
        });
        const token = Buffer.from(sessionData).toString('base64');

        const cookieStore = await cookies();
        cookieStore.set('panel_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

        return NextResponse.json({
            success: true,
            user: {
                _id: member._id.toString(),
                name: member.name,
                username: member.username,
                designation: member.designation,
                rankLevel: member.rankLevel,
                department: member.department,
                score: member.score,
                imageUrl: member.imageUrl,
                evaluationHistory: member.evaluationHistory,
                isAdmin: false,
            },
        });
    } catch (error) {
        console.error('Panel login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
