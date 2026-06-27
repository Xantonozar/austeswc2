import mongoose from 'mongoose';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://meal:BlUntsfgPGpR2SkW@mymongo.rhcri.mongodb.net/austeswc?retryWrites=true&w=majority&appName=MyMongo';

const CompetitionSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    teamName: String,
    members: [{ name: String, email: String, phone: String }],
    type: String,
    status: String,
    round: Number,
    bkashTxId: String,
    paymentMethod: String,
    paymentVerified: Boolean,
    bkashTxIdRound2: String,
    paymentMethodRound2: String,
    paymentVerifiedRound2: Boolean,
    createdAt: Date,
});

const Competition = mongoose.models.Competition || mongoose.model('Competition', CompetitionSchema);

const FEE_MAP = {
    'eco-capture': 300,
    'eco-buzzers': 720,
    'green-story': 400,
    'eco-pitch': 300,
};

async function exportPaidCompetitions() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'austeswc' });
        console.log('Connected to MongoDB');

        const all = await Competition.find({}).sort({ createdAt: -1 }).lean();
        console.log(`Total competitions: ${all.length}`);

        const results = [];

        for (const c of all) {
            const baseFee = FEE_MAP[c.type] || 0;

            // Round 1 payment: eco-buzzers, green-story, eco-pitch
            if (['eco-buzzers', 'green-story', 'eco-pitch'].includes(c.type)) {
                if (c.bkashTxId) {
                    results.push({
                        name: c.name || c.teamName,
                        email: c.email,
                        phone: c.phone || '',
                        competition: c.type,
                        amount: baseFee,
                        paymentNumber: c.bkashTxId,
                        paymentMethod: c.paymentMethod || '',
                        verified: c.paymentVerified || false,
                        round: 1,
                        registeredAt: c.createdAt,
                    });
                }
            }

            // Round 2 payment: eco-capture (300 BDT per selected photo)
            if (c.type === 'eco-capture' && c.bkashTxIdRound2) {
                const selectedPhotos = (c.photos || []).filter(p => p.selected);
                const amount = selectedPhotos.length * 300;
                results.push({
                    name: c.name || c.teamName,
                    email: c.email,
                    phone: c.phone || '',
                    competition: c.type,
                    amount,
                    paymentNumber: c.bkashTxIdRound2,
                    paymentMethod: c.paymentMethodRound2 || '',
                    verified: c.paymentVerifiedRound2 || false,
                    round: 2,
                    selectedPhotos: selectedPhotos.length,
                    registeredAt: c.createdAt,
                });
            }
        }

        console.log(`Found ${results.length} paid entries (Round 1 + Round 2)`);

        const outputPath = resolve('paid-competitions.json');
        writeFileSync(outputPath, JSON.stringify(results, null, 2));
        console.log(`Saved to ${outputPath}`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

exportPaidCompetitions();
