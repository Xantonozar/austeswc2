import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import PanelMember from '@/models/PanelMember';
import bcrypt from 'bcryptjs';

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

// GET - List panel members (supports ?status=active|alumni|all)
export async function GET(req) {
    try {
        const session = await getPanelSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get('status') || 'active';

        await connectDB();
        const query = statusFilter === 'all' ? {} : { status: statusFilter };
        const members = await PanelMember.find(query, '-password').sort({ rankLevel: -1 }).lean();

        const serialized = members.map(m => ({
            ...m,
            _id: m._id.toString(),
        }));

        return NextResponse.json({ members: serialized });
    } catch (error) {
        console.error('Error fetching panel members:', error);
        return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
    }
}

// POST - Add a new panel member
export async function POST(req) {
    try {
        const session = await getPanelSession();
        if (!session || !session.isAdmin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const { name, username, password, designation, rankLevel, department, imageUrl } = body;

        if (!name || !username || !password || !designation || rankLevel === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        const existing = await PanelMember.findOne({ username: username.toLowerCase().trim() });
        if (existing) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const currentSemester = getSemesterFromDate(new Date());

        const newMember = await PanelMember.create({
            name,
            username: username.toLowerCase().trim(),
            password: hashedPassword,
            designation,
            rankLevel: parseInt(rankLevel),
            department: department || null,
            imageUrl: imageUrl || '',
            status: 'active',
            semesterJoined: currentSemester,
        });

        const memberObj = newMember.toObject();
        delete memberObj.password;
        memberObj._id = memberObj._id.toString();

        return NextResponse.json({ success: true, member: memberObj }, { status: 201 });
    } catch (error) {
        console.error('Error adding panel member:', error);
        return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
    }
}

// PUT - Update member details (designation, rank, department)
export async function PUT(req) {
    try {
        const session = await getPanelSession();
        if (!session || !session.isAdmin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const { memberId, designation, rankLevel, department } = body;

        if (!memberId) {
            return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
        }

        await connectDB();
        const member = await PanelMember.findById(memberId);
        if (!member) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        const currentSemester = getSemesterFromDate(new Date());

        // Save old role to history before updating
        member.roleHistory.push({
            designation: member.designation,
            rankLevel: member.rankLevel,
            department: member.department,
            semester: currentSemester,
        });

        if (designation !== undefined) member.designation = designation;
        if (rankLevel !== undefined) member.rankLevel = parseInt(rankLevel);
        if (department !== undefined) member.department = department || null;

        await member.save();

        const memberObj = member.toObject();
        delete memberObj.password;
        memberObj._id = memberObj._id.toString();

        return NextResponse.json({ success: true, member: memberObj });
    } catch (error) {
        console.error('Error updating member:', error);
        return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
    }
}

// DELETE - Remove a panel member (hard delete)
export async function DELETE(req) {
    try {
        const session = await getPanelSession();
        if (!session || !session.isAdmin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
        }

        await connectDB();
        const deleted = await PanelMember.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting panel member:', error);
        return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
    }
}
