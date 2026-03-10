import { NextResponse } from 'next/server';
import { uploadBase64 } from '@/lib/cloudinary';

export async function POST(req) {
    try {
        const body = await req.json();
        const { imageBase64 } = body;

        if (!imageBase64) {
            return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
        }

        console.log('[Panel Upload] Uploading image to Cloudinary...');
        const result = await uploadBase64(imageBase64, 'eswc_panel_members');
        console.log('[Panel Upload] Success:', result.url);

        return NextResponse.json({ url: result.url });
    } catch (error) {
        console.error('[Panel Upload] Error:', error);
        return NextResponse.json({ error: 'Failed to upload image', message: error.message }, { status: 500 });
    }
}
