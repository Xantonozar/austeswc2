import mongoose from 'mongoose';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://meal:BlUntsfgPGpR2SkW@mymongo.rhcri.mongodb.net/austeswc?retryWrites=true&w=majority&appName=MyMongo';

const ApplicationSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    studentId: String,
    department: String,
    semester: String,
    section: String,
    role: String,
    motivation: String,
    experience: String,
    fbLink: String,
    isOtherClubAmbassador: String,
    convinceStrategy: String,
    imageUrl: String,
    status: String,
    createdAt: Date,
});

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

async function exportBatchAmbassadors() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'austeswc' });
        console.log('Connected to MongoDB');

        const batchAmbassadors = await Application.find({ role: 'Batch Ambassador' })
            .sort({ createdAt: -1 })
            .lean();

        console.log(`Found ${batchAmbassadors.length} Batch Ambassador applications`);

        const outputPath = resolve('batch-ambassadors.json');
        writeFileSync(outputPath, JSON.stringify(batchAmbassadors, null, 2));

        console.log(`Saved to ${outputPath}`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

exportBatchAmbassadors();
