import connectDB from '@/lib/mongodb';
import Competition from '@/models/Competition';

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        if (body.action === 'check_status') {
            const { email } = body;
            if (!email) return new Response(JSON.stringify({ error: 'missing_email', message: 'Email is required' }), { status: 400 });
            const emailLower = email.toLowerCase().trim();
            const registrations = await Competition.find({
                $or: [
                    { email: emailLower },
                    { 'members.email': emailLower }
                ]
            }).sort({ createdAt: -1 });
            if (!registrations || registrations.length === 0) return new Response(JSON.stringify({ error: 'not_found', message: 'No registrations found for this email' }), { status: 404 });
            return new Response(JSON.stringify({ result: 'success', data: registrations }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const { id, bkashTxId } = body;
        if (!id || !bkashTxId) return new Response(JSON.stringify({ error: 'missing_fields', message: 'ID and Transaction ID are required' }), { status: 400 });

        const competitor = await Competition.findById(id);
        if (!competitor) return new Response(JSON.stringify({ error: 'not_found', message: 'Competitor not found' }), { status: 404 });
        if (competitor.status !== 'selected' && competitor.status !== 'rejected') return new Response(JSON.stringify({ error: 'invalid_status', message: 'You must be selected for Round 2 to make a payment' }), { status: 400 });

        const isPoster = competitor.type === 'poster-presentation';

        if (isPoster) {
            const { paymentMethod, paymentSenderNumber, paymentScreenshotBase64, teamPhotosBase64, isClubMember, clubMemberId, paymentAmount } = body;
            if (!paymentSenderNumber) return new Response(JSON.stringify({ error: 'missing_sender', message: 'Sender bKash/Nagad number is required' }), { status: 400 });
            if (!paymentScreenshotBase64) return new Response(JSON.stringify({ error: 'missing_screenshot', message: 'Payment screenshot is required' }), { status: 400 });
            if (!teamPhotosBase64 || !Array.isArray(teamPhotosBase64) || teamPhotosBase64.length === 0) return new Response(JSON.stringify({ error: 'missing_photos', message: 'At least one team photo is required' }), { status: 400 });
            if (isClubMember && !clubMemberId) return new Response(JSON.stringify({ error: 'missing_memberId', message: 'Club Member ID is required for discount' }), { status: 400 });

            const existing = await Competition.findOne({ bkashTxIdRound2: bkashTxId.trim().toUpperCase(), _id: { $ne: id } });
            if (existing) return new Response(JSON.stringify({ error: 'duplicate_payment', message: 'This Transaction ID has already been used' }), { status: 400 });

            const { uploadBase64 } = await import('@/lib/cloudinary');
            let screenshot = null;
            try {
                screenshot = await uploadBase64(paymentScreenshotBase64, 'eswc_competition/poster_round2_payments');
            } catch (e) {
                return new Response(JSON.stringify({ error: 'screenshot_upload_failed', message: e.message || 'Screenshot upload failed' }), { status: 500 });
            }
            const uploadedPhotos = [];
            for (let i = 0; i < Math.min(teamPhotosBase64.length, 4); i++) {
                try {
                    const r = await uploadBase64(teamPhotosBase64[i], 'eswc_competition/poster_round2_photos');
                    uploadedPhotos.push({ url: r.url, publicId: r.publicId });
                } catch (e) {
                    return new Response(JSON.stringify({ error: 'photo_upload_failed', message: `Photo ${i+1} upload failed: ${e.message}` }), { status: 500 });
                }
            }

            const expectedAmount = isClubMember ? 399 : 499;
            competitor.bkashTxIdRound2 = bkashTxId.trim().toUpperCase();
            competitor.paymentMethodRound2 = paymentMethod || 'bkash';
            competitor.paymentSenderNumber = paymentSenderNumber.trim();
            competitor.paymentScreenshotUrl = screenshot.url;
            competitor.paymentScreenshotPublicId = screenshot.publicId;
            competitor.teamPhotos = uploadedPhotos;
            competitor.isClubMember = !!isClubMember;
            competitor.clubMemberId = clubMemberId ? clubMemberId.trim() : '';
            competitor.paymentAmount = paymentAmount || expectedAmount;
            competitor.round2PosterTitle = body.round2PosterTitle || competitor.posterTitle;
            competitor.status = 'paid';
            await competitor.save();

            try {
                const { sendPaymentSuccessEmail } = await import('@/lib/brevo');
                await sendPaymentSuccessEmail(competitor.email, competitor.teamName || competitor.name, competitor.type);
            } catch (e) { console.error('Failed to send payment email:', e); }

            return new Response(JSON.stringify({ result: 'success', data: competitor }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const isRound2 = competitor.paymentVerified === true;
        if (isRound2) {
            competitor.bkashTxIdRound2 = bkashTxId.trim().toUpperCase();
            competitor.paymentMethodRound2 = body.paymentMethod || 'bkash';
            competitor.status = 'paid';
        } else {
            competitor.bkashTxId = bkashTxId.trim().toUpperCase();
            competitor.paymentMethod = body.paymentMethod || 'bkash';
            competitor.status = 'registered';
        }
        await competitor.save();
        if (isRound2) {
            const { sendPaymentSuccessEmail } = await import('@/lib/brevo');
            try { await sendPaymentSuccessEmail(competitor.email, competitor.teamName || competitor.name, competitor.type); } catch (e) { console.error('Failed to send payment success email:', e); }
        }
        return new Response(JSON.stringify({ result: 'success', data: competitor }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error('Competition Payment API Error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
