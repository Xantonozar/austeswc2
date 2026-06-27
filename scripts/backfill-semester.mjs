import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://meal:BlUntsfgPGpR2SkW@mymongo.rhcri.mongodb.net/austeswc?retryWrites=true&w=majority&appName=MyMongo';

const MemberSchema = new mongoose.Schema({}, { strict: false });
const Member = mongoose.models.Member || mongoose.model('Member', MemberSchema);

function getSemesterFromDate(date) {
    const month = date.getMonth() + 1; // 1-12
    const year = date.getFullYear();
    if (month >= 6 && month <= 11) return `Fall ${year}`;
    if (month === 12) return `Spring ${year + 1}`;
    return `Spring ${year}`;
}

async function backfill() {
    await mongoose.connect(MONGODB_URI, { dbName: 'austeswc' });
    console.log('Connected to MongoDB');

    // Find all members without recruitmentSemester
    const members = await Member.find({ recruitmentSemester: { $exists: false } }).lean();
    console.log(`Found ${members.length} members to backfill`);

    if (members.length === 0) {
        console.log('Nothing to backfill. All members already have recruitmentSemester.');
        process.exit(0);
    }

    // Show preview
    const preview = members.slice(0, 5).map(m => ({
        name: m.name,
        createdAt: m.createdAt,
        semester: getSemesterFromDate(new Date(m.createdAt)),
    }));
    console.log('\nPreview (first 5):');
    preview.forEach(p => console.log(`  ${p.name} | Created: ${p.createdAt?.toISOString().split('T')[0]} → ${p.semester}`));

    // Bulk update
    let updated = 0;
    for (const m of members) {
        const semester = getSemesterFromDate(new Date(m.createdAt));
        await Member.updateOne(
            { _id: m._id },
            { $set: { recruitmentSemester: semester } }
        );
        updated++;
        if (updated % 10 === 0 || updated === members.length) {
            console.log(`  Progress: ${updated}/${members.length}`);
        }
    }

    console.log(`\nDone! Updated ${updated} members.`);
    process.exit(0);
}

backfill().catch(e => { console.error(e); process.exit(1); });
