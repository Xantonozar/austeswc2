import connectDB from '@/lib/mongodb';
import DataCollect from '@/models/DataCollect';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const records = await DataCollect.find({}, 'name position imageUrl department team email phone createdAt')
            .sort({ createdAt: -1 })
            .lean();
        return new Response(JSON.stringify({ records }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('DataCollect GET Error:', err);
        return new Response(JSON.stringify({ error: 'Failed to fetch records' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        const advTreasPositions = ['Advisor', 'Treasurer'];
        const isAdvOrTreas = advTreasPositions.includes(body.position);

        if (!isAdvOrTreas && body.studentId) {
            const existing = await DataCollect.findOne({ studentId: body.studentId });
            if (existing) {
                return new Response(JSON.stringify({ error: 'Student ID already exists' }), {
                    status: 409,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        const record = await DataCollect.create({
            name: body.name,
            email: body.email || '',
            phone: body.phone || '',
            imageUrl: body.imageUrl || '',
            publicId: body.publicId || '',
            yearSemester: body.yearSemester || '',
            labGroup: body.labGroup || '',
            department: body.department || '',
            team: body.team || '',
            position: body.position || '',
            ...(isAdvOrTreas ? {} : { studentId: body.studentId || '' }),
            routineImageUrl: body.routineImageUrl || '',
            routinePublicId: body.routinePublicId || '',
        });

        return new Response(JSON.stringify({ success: true, record }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('DataCollect API Error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return new Response(JSON.stringify({ error: messages.join(', ') }), {
                status: 422,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
