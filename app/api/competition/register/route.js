import connectDB from '@/lib/mongodb';
import Competition from '@/models/Competition';
import { sendCompetitionRegistrationEmail } from '@/lib/brevo';

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        // Type checking
        const validTypes = ['eco-capture', 'eco-buzzers', 'green-story', 'eco-pitch'];
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

        let processedData = { ...body };
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

        // Process Eco Pitch PDF — use dedicated raw uploader
        if (body.type === 'eco-pitch' && body.pdfBase64) {
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

        // Paid comps default status
        if (['eco-buzzers', 'green-story', 'eco-pitch'].includes(body.type)) {
            processedData.status = 'paid'; // Automatically paid status if tx id is provided on registration
            if (!body.bkashTxId) {
                return new Response(JSON.stringify({ error: 'payment_required', message: 'Transaction ID is required' }), { status: 400 });
            }
        }

        // Create record
        const registration = await Competition.create(processedData);

        // Send confirmation email asynchronously
        const recipientName = processedData.name || processedData.teamName || 'Participant';
        sendCompetitionRegistrationEmail(processedData.email, recipientName, processedData.type).catch(console.error);

        return new Response(JSON.stringify({ result: 'success', data: registration }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Competition Registration API Error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
