import mongoose from 'mongoose';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://meal:BlUntsfgPGpR2SkW@mymongo.rhcri.mongodb.net/austeswc?retryWrites=true&w=majority&appName=MyMongo';

const CompetitionSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    teamName: String,
    universityName: String,
    members: [{ name: String, email: String, phone: String, studentId: String, universityName: String }],
    pdfUrl: String,
    type: String,
    status: String,
    round: Number,
    bkashTxId: String,
    paymentMethod: String,
    paymentVerified: Boolean,
    bkashTxIdRound2: String,
    paymentMethodRound2: String,
    paymentVerifiedRound2: Boolean,
    caReference: String,
    createdAt: Date,
});

const Competition = mongoose.models.Competition || mongoose.model('Competition', CompetitionSchema);

const ROUND1_FEE = 300;
const ROUND2_FEE = 300;

async function exportEcoPitch() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'austeswc' });
        console.log('Connected to MongoDB');

        const records = await Competition.find({ type: 'eco-pitch' }).sort({ createdAt: -1 }).lean();
        console.log(`Found ${records.length} eco-pitch entries`);

        const entries = records.map(c => {
            const entry = {
                teamName: c.teamName || c.name || '',
                email: c.email,
                phone: c.phone || '',
                status: c.status,
                registeredAt: c.createdAt,
                members: (c.members || []).map(m => ({
                    name: m.name || '',
                    email: m.email || '',
                    phone: m.phone || '',
                    studentId: m.studentId || '',
                    university: m.universityName || '',
                })),
                round1: {
                    paid: !!c.bkashTxId,
                    amount: c.bkashTxId ? ROUND1_FEE : 0,
                    transactionId: c.bkashTxId || '',
                    paymentMethod: (c.paymentMethod || '').toUpperCase(),
                    verified: c.paymentVerified || false,
                },
                round2: {
                    selected: c.status === 'selected' || c.status === 'paid',
                    paid: !!c.bkashTxIdRound2,
                    amount: c.bkashTxIdRound2 ? ROUND2_FEE : 0,
                    transactionId: c.bkashTxIdRound2 || '',
                    paymentMethod: (c.paymentMethodRound2 || '').toUpperCase(),
                    verified: c.paymentVerifiedRound2 || false,
                },
                pdfUrl: c.pdfUrl || '',
            };
            return entry;
        });

        const outputPath = resolve('competitions-by-category', 'eco-pitch.json');
        writeFileSync(outputPath, JSON.stringify(entries, null, 2));
        console.log(`Saved ${entries.length} entries to ${outputPath}`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

exportEcoPitch();
