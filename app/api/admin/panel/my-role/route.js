import { NextResponse } from 'next/server';
import { getAdminFromSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const admin = await getAdminFromSession();

    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ id: admin.id, name: admin.name, role: admin.role });
}
