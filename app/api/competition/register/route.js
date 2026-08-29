import connectDB from '@/lib/mongodb';
import Competition from '@/models/Competition';
import { sendCompetitionRegistrationEmail } from '@/lib/brevo';

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        // Type checking
        const validTypes = ['eco-capture', 'eco-buzzers', 'green-story', 'eco-pitch', 'poster-presentation', 'eco-frame'];
        if (!validTypes.includes(body.type)) {
            return new Response(JSON.stringify({ error: 'invalid_type', message: 'Invalid competition type' }), { status: 400 });
        }

        // Basic required fields across all
        if (!body.email) {
            return new Response(JSON.stringify({ error: 'missing_fields', message: 'Email is required' }), { status: 400 });
        }

        // Handle Cloudinary Uploads conditionally here if base64 images/pdfs are passed, 
        // similar to the member submission. But to keep the payload clean, 
        // we expect the client to have uploaded the files (or pass base64 to be uploaded).
        // For simplicity, we assume the client passed `imageBase64` arrays or strings and we upload them now.

        let processedData = {
            ...body,
            paymentMethod: body.paymentMethod || 'bkash'
        };
        const { uploadBase64 } = await import('@/lib/cloudinary');

        // Process Eco-Capture photos
        if (body.type === 'eco-capture' && body.photosReady && Array.isArray(body.photosReady)) {
            // Photos are already uploaded directly to Cloudinary from the client
            processedData.photos = body.photosReady.map(photo => ({
                url: photo.url,
                publicId: photo.publicId,
                story: photo.story
            }));
            delete processedData.photosReady;
            processedData.status = 'registered'; // Free first round
        }

        // Process Poster Presentation member photos (Round 1)
        if (body.type === 'poster-presentation' && Array.isArray(body.members)) {
            const { uploadBase64 } = await import('@/lib/cloudinary');
            const processedMembers = [];
            for (const m of body.members) {
                let photo = undefined;
                if (m.photoBase64) {
                    try {
                        const result = await uploadBase64(m.photoBase64, 'eswc_competition_members');
                        photo = { url: result.url, publicId: result.publicId };
                    } catch (e) {
                        console.error('[Poster] Member photo upload failed:', e);
                    }
                }
                const { photoBase64, ...rest } = m;
                processedMembers.push({ ...rest, photo });
            }
            processedData.members = processedMembers;
        }

        // Process Eco Frame photos + payment screenshot (paid photo contest) — Cloudinary
        if (body.type === 'eco-frame') {
            if (Array.isArray(body.photosReady)) {
                processedData.photos = body.photosReady.map(photo => ({
                    url: photo.url,
                    publicId: photo.publicId,
                    theme: photo.theme,
                    title: photo.title,
                    caption: photo.caption
                }));
                delete processedData.photosReady;
            }
            if (body.paymentScreenshot && body.paymentScreenshot.url) {
                processedData.paymentScreenshotUrl = body.paymentScreenshot.url;
                processedData.paymentScreenshotPublicId = body.paymentScreenshot.publicId;
                delete processedData.paymentScreenshot;
            }
            processedData.status = 'registered';
        }

        // Process Eco Pitch / Poster Presentation PDF — use dedicated raw uploader
        if ((body.type === 'eco-pitch' || body.type === 'poster-presentation') && body.pdfBase64) {
            try {
                const { uploadPdfBase64 } = await import('@/lib/cloudinary');
                console.log('[Eco Pitch] Uploading PDF, base64 length:', body.pdfBase64.length);
                const result = await uploadPdfBase64(body.pdfBase64, 'eswc_competition');
                console.log('[Eco Pitch] PDF uploaded successfully:', result.url);
                processedData.pdfUrl = result.url;
                processedData.pdfPublicId = result.publicId;
                delete processedData.pdfBase64;
            } catch (e) {
                console.error('[Eco Pitch] PDF upload failed:', e);
                return new Response(JSON.stringify({ error: 'pdf_upload_failed', message: e.message || 'PDF upload failed' }), { status: 500 });
            }
        }

        // Initial registration status is ALWAYS 'registered'
        // Admin will review payment and then 'select' them for Round 2
        processedData.status = 'registered';

        // Paid comps validation
        if (['eco-buzzers', 'eco-pitch', 'green-story', 'eco-frame'].includes(body.type)) {
            if (!body.bkashTxId) {
                return new Response(JSON.stringify({ error: 'payment_required', message: 'Transaction ID is required' }), { status: 400 });
            }

            // [DEDUPLICATION] Check if this Transaction ID already exists
            const existingPayment = await Competition.findOne({
                bkashTxId: body.bkashTxId.trim().toUpperCase(),
                type: body.type
            });
            if (existingPayment) {
                return new Response(JSON.stringify({ error: 'duplicate_payment', message: 'This Transaction ID has already been used for this competition.' }), { status: 400 });
            }
        }

        // [DEDUPLICATION] Prevent very rapid double submissions (within 10 seconds)
        const tenSecondsAgo = new Date(Date.now() - 10000);
        const recentSubmission = await Competition.findOne({
            email: body.email.toLowerCase(),
            type: body.type,
            createdAt: { $gte: tenSecondsAgo }
        });

        if (recentSubmission) {
            return new Response(JSON.stringify({ error: 'duplicate_submission', message: 'We already received your submission. Please wait a moment.' }), { status: 400 });
        }

        // Create record
        const registration = await Competition.create(processedData);

        const recipientName = processedData.name || processedData.teamName || 'Participant';
        const PAID_TYPES = ['eco-buzzers', 'eco-pitch', 'green-story', 'eco-frame'];
        const FEE_MAP = { 'eco-buzzers': '100', 'eco-pitch': '300', 'green-story': '700', 'eco-frame': '149' };
        const isPaid = PAID_TYPES.includes(body.type);

        try {
            await sendCompetitionRegistrationEmail(processedData.email, recipientName, processedData.type, {
                teamName: processedData.teamName || processedData.name,
                members: processedData.members || [],
                fee: isPaid ? FEE_MAP[body.type] : null
            });
        } catch (emailError) {
            console.error('Failed to send registration email:', emailError);
            // We still return success for the registration itself even if email fails
        }

        // Send a dedicated payment-confirmation email for paid registrations
        if (isPaid) {
            try {
                const { sendPaymentConfirmationEmail } = await import('@/lib/brevo');
                await sendPaymentConfirmationEmail(
                    processedData.email,
                    recipientName,
                    processedData.type,
                    {
                        amount: FEE_MAP[body.type],
                        method: processedData.paymentMethod || 'bKash',
                        trxId: processedData.bkashTxId || ''
                    }
                );
            } catch (payEmailError) {
                console.error('Failed to send payment confirmation email:', payEmailError);
            }
        }

        return new Response(JSON.stringify({ result: 'success', data: registration }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Competition Registration API Error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
