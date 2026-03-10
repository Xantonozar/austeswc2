import connectDB from '@/lib/mongodb';
import Competition from '@/models/Competition';

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        // Used by check-status page to get status via email
        if (body.action === 'check_status') {
            const { email } = body;
            if (!email) {
                return new Response(JSON.stringify({ error: 'missing_email', message: 'Email is required' }), { status: 400 });
            }

            const registrations = await Competition.find({ email }).sort({ createdAt: -1 });

            if (!registrations || registrations.length === 0) {
                return new Response(JSON.stringify({ error: 'not_found', message: 'No registrations found for this email' }), { status: 404 });
            }

            // Return all registrations for this email in case they registered for multiple
            return new Response(JSON.stringify({ result: 'success', data: registrations }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Existing flow: Used by check-status page to submit payment TxID
        const { id, bkashTxId } = body;

        if (!id || !bkashTxId) {
            return new Response(JSON.stringify({ error: 'missing_fields', message: 'ID and Transaction ID are required' }), { status: 400 });
        }

        const competitor = await Competition.findById(id);

        if (!competitor) {
            return new Response(JSON.stringify({ error: 'not_found', message: 'Competitor not found' }), { status: 404 });
        }

        if (competitor.status !== 'selected') {
            return new Response(JSON.stringify({ error: 'invalid_status', message: 'You must be selected for Round 2 to make a payment' }), { status: 400 });
        }

        competitor.bkashTxId = bkashTxId;
        competitor.status = 'paid';
        await competitor.save();

        // Trigger payment success email asynchronously
        const { sendPaymentSuccessEmail } = await import('@/lib/brevo');
        const participantName = competitor.teamName || competitor.name;
        sendPaymentSuccessEmail(competitor.email, participantName, competitor.type);

        return new Response(JSON.stringify({ result: 'success', data: competitor }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err) {
        console.error('Competition Payment API Error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
