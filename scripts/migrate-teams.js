import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://meal:BlUntsfgPGpR2SkW@mymongo.rhcri.mongodb.net/austeswc?retryWrites=true&w=majority&appName=MyMongo';

const AdminSchema = new mongoose.Schema({
    username: String, password: String, name: String, email: String, role: String, team: String, createdAt: Date,
}, { strict: false });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

const teams = [
    'Event Management', 'Logistics', 'Research & Development',
    'Public Relationship', 'Content Writing', 'Graphics', 'Web Development',
];

const targetRoles = ['executive', 'senior sub executive', 'sub executive', 'junior executive'];

async function migrate() {
    await mongoose.connect(MONGODB_URI, { dbName: 'austeswc' });
    console.log('Connected to MongoDB');

    const admins = await Admin.find({ role: { $in: targetRoles } });
    console.log(`Found ${admins.length} members to assign teams`);

    for (let i = 0; i < admins.length; i++) {
        const team = teams[i % teams.length];
        await Admin.updateOne({ _id: admins[i]._id }, { $set: { team } });
        console.log(`  ${admins[i].name} (${admins[i].role}) → ${team}`);
    }

    console.log('\nMigration complete!');
    process.exit(0);
}

migrate().catch(e => { console.error(e); process.exit(1); });
