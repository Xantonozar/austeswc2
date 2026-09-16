import connectDB from '@/lib/mongodb';
import Competition from '@/models/Competition';

export async function POST(req) {
    try {
        await connectDB();

        const participants = await Competition.find({ type: 'eco-frame' }).sort({ createdAt: -1 }).lean();
        console.log(`Found ${participants.length} eco-frame participants`);

        if (participants.length === 0) {
            return new Response(JSON.stringify({ result: 'success', message: 'No eco-frame participants found', total: 0, sent: 0, failed: 0 }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { sendEcoFramePhotoPostedEmail } = await import('@/lib/brevo');

        let sent = 0;
        let failed = 0;
        const failedEmails = [];

        for (const p of participants) {
            const email = p.email;
            const name = p.teamName || p.name || 'Participant';
            if (!email) {
                failed++;
                failedEmails.push(name);
                continue;
            }
            try {
                await sendEcoFramePhotoPostedEmail(email, name);
                sent++;
            } catch (err) {
                console.error(`Failed to send to ${email}:`, err.message);
                failed++;
                failedEmails.push(email);
            }
        }

        return new Response(JSON.stringify({
            result: 'success',
            total: participants.length,
            sent,
            failed,
            failedEmails
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
