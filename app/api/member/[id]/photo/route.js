import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Member from '@/models/Member';

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        await connectDB();
        const member = await Member.findById(id).select('imageBase64 imageType');

        if (!member || !member.imageBase64) {
            return new NextResponse('Image not found', { status: 404 });
        }

        const buffer = Buffer.from(member.imageBase64, 'base64');

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': member.imageType,
                'Content-Length': buffer.length.toString(),
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving image:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
