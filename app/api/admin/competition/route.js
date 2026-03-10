import connectDB from '@/lib/mongodb';
import Competition from '@/models/Competition';

// Get all competitors
export async function GET(req) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const type = url.searchParams.get('type');

        let query = {};
        if (type && type !== 'all') {
            query.type = type;
        }

        const competitors = await Competition.find(query).sort({ createdAt: -1 });

        return new Response(JSON.stringify({ result: 'success', data: competitors }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

// Update status (e.g. select for round 2, verify payment, eliminate)
export async function PATCH(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, status, paymentVerified, bkashTxId } = body;

        if (!id) {
            return new Response(JSON.stringify({ error: 'missing_id', message: 'ID is required' }), { status: 400 });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (typeof paymentVerified === 'boolean') updateData.paymentVerified = paymentVerified;
        if (bkashTxId !== undefined) updateData.bkashTxId = bkashTxId;

        // Get the current document to see if status is actually changing
        const competitor = await Competition.findById(id);
        if (!competitor) {
            return new Response(JSON.stringify({ error: 'not_found', message: 'Competitor not found' }), { status: 404 });
        }

        const updated = await Competition.findByIdAndUpdate(id, updateData, { new: true });

        // Trigger emails asynchronously (don't block the response)
        const { sendSelectionEmail, sendPaymentSuccessEmail } = await import('@/lib/brevo');

        const participantName = updated.teamName || updated.name;

        // Send selection email if status just changed to 'selected'
        if (status === 'selected' && competitor.status !== 'selected') {
            sendSelectionEmail(updated.email, participantName, updated.type);
        }

        // Send payment success if payment just got verified
        if (paymentVerified === true && competitor.paymentVerified !== true) {
            sendPaymentSuccessEmail(updated.email, participantName, updated.type);
        }

        return new Response(JSON.stringify({ result: 'success', data: updated }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

// Delete a competitor
export async function DELETE(req) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return new Response(JSON.stringify({ error: 'missing_id', message: 'ID is required' }), { status: 400 });
        }

        await Competition.findByIdAndDelete(id);

        return new Response(JSON.stringify({ result: 'success' }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
