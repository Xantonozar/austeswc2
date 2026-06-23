import connectDB from '@/lib/mongodb';
import Member from '@/models/Member';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get('studentId');
        const email = searchParams.get('email');

        if (!studentId && !email) {
            return Response.json({ exists: false });
        }

        await connectDB();

        const query = {};
        if (studentId) query.studentId = studentId.trim().toUpperCase();
        if (email) query.email = email.trim().toLowerCase();

        const existing = await Member.findOne(query).select('_id').lean();

        return Response.json({ exists: !!existing });
    } catch (err) {
        console.error('Check duplicate error:', err);
        return Response.json({ exists: false });
    }
}
