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
            experience,
            fbLink,
            isOtherClubExecutive,
            teamPreferences,
            skillHelp,
            imageUrl
        } = body;

        // Basic validation
        if (!name || !email || !phone || !studentId || !department || !semester || !role || !fbLink || !teamPreferences || teamPreferences.length < 3 || !skillHelp || !imageUrl) {
            return NextResponse.json(
                { success: false, message: 'All fields are required, at least 3 teams must be selected, and a photo is mandatory.' },
                { status: 400 }
            );
        }

        const validRoles = ['Junior Executive', 'Sub Executive'];
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
            experience,
            fbLink,
            isOtherClubExecutive,
            teamPreferences,
            skillHelp,
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
