import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Member from '@/models/Member';

export const dynamic = 'force-dynamic';

function getSemesterFromDate(date) {
    const d = new Date(date);
    const month = d.getMonth();
    const year = d.getFullYear();
    if (month >= 5 && month <= 10) return `Fall ${year - 1}`;
    if (month >= 11) return `Spring ${year}`;
    return `Spring ${year - 1}`;
}

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const requestedSemester = searchParams.get('semester');

        const currentSemester = getSemesterFromDate(new Date());

        const allPresidents = await Admin.find({ role: 'president' }).sort({ createdAt: -1 }).lean();

        let president = null;

        if (requestedSemester) {
            president = allPresidents.find(p => getSemesterFromDate(p.createdAt) === requestedSemester);
        }

        if (!president) {
            president = allPresidents.find(p => getSemesterFromDate(p.createdAt) === currentSemester);
        }

        if (!president && allPresidents.length > 0) {
            president = allPresidents[0];
        }

        if (!president) {
            return new Response(JSON.stringify({ number: '01639802823', source: 'fallback', semester: currentSemester }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        let number = president.phone || president.bkash || president.bkashId || president.mobile || null;

        if (!number && president.email) {
            const member = await Member.findOne({ email: president.email.toLowerCase() }).lean();
            if (member) number = member.phone || member.bkashId || null;
        }

        if (!number && president.name) {
            const memberByName = await Member.findOne({ name: president.name }).sort({ createdAt: -1 }).lean();
            if (memberByName) number = memberByName.phone || memberByName.bkashId || null;
        }

        if (!number) number = '01639802823';

        return new Response(JSON.stringify({
            number,
            name: president.name,
            email: president.email,
            semester: getSemesterFromDate(president.createdAt),
            currentSemester,
            source: number === '01639802823' ? 'fallback' : 'db'
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error('president-bkash error', err);
        return new Response(JSON.stringify({ number: '01639802823', source: 'error' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
}
