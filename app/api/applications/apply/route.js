import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Application from '@/models/Application';

const MONGODB_URI = process.env.MONGODB_URI;

export async function POST(request) {
    try {
        const body = await request.json();
        
        if (!mongoose.connections[0].readyState) {
            await mongoose.connect(MONGODB_URI);
        }

        const {
            name,
            email,
            phone,
            studentId,
            department,
            semester,
            role,
            section,
            motivation,
            experience,
            fbLink,
            isOtherClubAmbassador,
            convinceStrategy,
            imageUrl
        } = body;

        // Basic validation
        if (!name || !email || !phone || !studentId || !department || !semester || !role || !motivation || !fbLink || !convinceStrategy) {
            return NextResponse.json(
                { success: false, message: 'All fields are required.' },
                { status: 400 }
            );
        }

        const validRoles = ['Batch Ambassador', 'Junior Executive', 'Sub Executive'];
        if (!validRoles.includes(role)) {
             return NextResponse.json(
                { success: false, message: 'Invalid role selected.' },
                { status: 400 }
            );
        }

        const application = new Application({
            name,
            email,
            phone,
            studentId,
            department,
            semester,
            role,
            section,
            motivation,
            experience,
            fbLink,
            isOtherClubAmbassador,
            convinceStrategy,
            imageUrl
        });

        await application.save();

        return NextResponse.json({
            success: true,
            message: 'Application submitted successfully!',
            applicationId: application._id
        });

    } catch (error) {
        console.error('Application Submission Error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error during submission.', error: error.message },
            { status: 500 }
        );
    }
}
