import mongoose from 'mongoose';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://meal:BlUntsfgPGpR2SkW@mymongo.rhcri.mongodb.net/austeswc?retryWrites=true&w=majority&appName=MyMongo';

const CompetitionSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    teamName: String,
    universityName: String,
    members: [{ name: String, email: String, phone: String, studentId: String, universityName: String }],
    photos: [{ url: String, publicId: String, story: String, selected: Boolean }],
    videoLink: String,
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

const FEE_MAP = { 'eco-capture': 300, 'eco-buzzers': 720, 'green-story': 400, 'eco-pitch': 300 };

async function exportByCategory() {
    await mongoose.connect(MONGODB_URI, { dbName: 'austeswc' });
    console.log('Connected to MongoDB');

    const all = await Competition.find({}).sort({ createdAt: -1 }).lean();
    console.log(`Total records: ${all.length}`);

    const outDir = resolve('competitions-by-category');
    try { mkdirSync(outDir); } catch {}

    // Group by type
    const groups = {};
    for (const c of all) {
        if (!groups[c.type]) groups[c.type] = [];
        groups[c.type].push(c);
    }

    for (const [type, records] of Object.entries(groups)) {
        const isTeam = ['eco-buzzers', 'green-story'].includes(type);
        const baseFee = FEE_MAP[type] || 0;

        const entries = records.map(c => {
            // Determine paidRound
            let paidRound = null;
            let txId = '';
            let payAmount = baseFee;
            let payMethod = (c.paymentMethod || '').toUpperCase();

            if (type === 'eco-capture') {
                // eco-capture: Round 1 is free, payment only happens for Round 2
                if (c.bkashTxIdRound2) {
                    paidRound = 2;
                    txId = c.bkashTxIdRound2;
                    payMethod = (c.paymentMethodRound2 || '').toUpperCase();
                    const selectedCount = (c.photos || []).filter(p => p.selected).length;
                    payAmount = selectedCount * baseFee;
                } else if (c.bkashTxId) {
                    // Admin stored Round 2 payment in bkashTxId field
                    paidRound = 2;
                    txId = c.bkashTxId;
                    const selectedCount = (c.photos || []).filter(p => p.selected).length;
                    payAmount = selectedCount * baseFee;
                }
            } else {
                // eco-buzzers, green-story, eco-pitch: paid at registration (Round 1)
                if (c.bkashTxId) {
                    paidRound = 1;
                    txId = c.bkashTxId;
                }
            }

            const entry = {
                name: c.name || c.teamName || '',
                phone: c.phone || '',
                email: c.email,
                transactionId: txId,
                paymentAmount: payAmount,
                paymentMethod: payMethod,
                paidRound,
            };

            if (isTeam) {
                entry.teamName = c.teamName || '';
                entry.universityName = c.universityName || '';
                entry.members = (c.members || []).map(m => ({
                    name: m.name || '',
                    email: m.email || '',
                    phone: m.phone || '',
                    studentId: m.studentId || '',
                    university: m.universityName || '',
                }));
            }

            if (type === 'eco-pitch') {
                entry.pdfUrl = c.pdfUrl || '';
            }

            if (type === 'eco-capture') {
                entry.photos = (c.photos || []).map(p => ({
                    url: p.url,
                    story: p.story,
                    selected: p.selected,
                }));
                entry.selectedPhotoCount = (c.photos || []).filter(p => p.selected).length;
                if (c.bkashTxIdRound2) {
                    entry.round2TransactionId = c.bkashTxIdRound2;
                    entry.round2PaymentAmount = entry.selectedPhotoCount * baseFee;
                    entry.round2PaymentMethod = (c.paymentMethodRound2 || '').toUpperCase();
                }
            }

            entry.status = c.status;
            entry.registeredAt = c.createdAt;
            return entry;
        });

        const fileName = `${type}.json`;
        writeFileSync(resolve(outDir, fileName), JSON.stringify(entries, null, 2));
        console.log(`✓ ${fileName} — ${entries.length} entries`);
    }

    // Summary
    const summary = Object.entries(groups).map(([type, recs]) => ({
        category: type,
        total: recs.length,
        paid: recs.filter(r => r.bkashTxId).length,
        amountPerEntry: FEE_MAP[type],
    }));
    writeFileSync(resolve(outDir, '_summary.json'), JSON.stringify(summary, null, 2));
    console.log('✓ _summary.json');

    process.exit(0);
}

exportByCategory().catch(e => { console.error(e); process.exit(1); });
