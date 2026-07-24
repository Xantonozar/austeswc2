import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://meal:BlUntsfgPGpR2SkW@mymongo.rhcri.mongodb.net/austeswc?retryWrites=true&w=majority&appName=MyMongo';

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    role: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const EvolutionSchema = new mongoose.Schema({
    targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    grantorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    points: { type: Number, required: true },
    reason: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
const Evolution = mongoose.models.Evolution || mongoose.model('Evolution', EvolutionSchema);

const admins = [
    { username: 'superadmin', name: 'Super Admin', email: 'superadmin@austeswc.org', role: 'superadmin' },
    { username: 'advisor', name: 'Dr. Advisor', email: 'advisor@austeswc.org', role: 'advisor' },
    { username: 'treasurer', name: 'Treasurer Boss', email: 'treasurer@austeswc.org', role: 'treasurer' },
    { username: 'president', name: 'Club President', email: 'president@austeswc.org', role: 'president' },
    { username: 'gs', name: 'General Secretary', email: 'gs@austeswc.org', role: 'gs' },
    { username: 'vp', name: 'Vice President', email: 'vp@austeswc.org', role: 'vp' },
    { username: 'js', name: 'Joint Secretary', email: 'js@austeswc.org', role: 'js' },
    { username: 'os', name: 'Org Secretary', email: 'os@austeswc.org', role: 'os' },
    { username: 'executive', name: 'Executive Head', email: 'executive@austeswc.org', role: 'executive' },
    { username: 'sse', name: 'Senior Sub Exec', email: 'sse@austeswc.org', role: 'senior sub executive' },
    { username: 'se', name: 'Sub Executive', email: 'se@austeswc.org', role: 'sub executive' },
    { username: 'je', name: 'Junior Executive', email: 'je@austeswc.org', role: 'junior executive' },
];

const defaultPassword = 'password123';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'austeswc' });
        console.log('Connected to MongoDB');

        await Admin.deleteMany({});
        await Evolution.deleteMany({});
        console.log('Cleared existing data');

        const hashedPassword = await bcrypt.hash(defaultPassword, 12);
        const createdAdmins = [];

        for (const a of admins) {
            const admin = await Admin.create({ ...a, password: hashedPassword });
            createdAdmins.push(admin);
            console.log(`Created: ${admin.username} (${admin.role})`);
        }

        const evolutionEntries = [
            { target: 'sse', grantor: 'executive', points: 15, reason: 'Excellent event coordination for Greenova' },
            { target: 'sse', grantor: 'os', points: 10, reason: 'Helped organize volunteer teams' },
            { target: 'se', grantor: 'executive', points: 8, reason: 'Good attendance at meetings' },
            { target: 'se', grantor: 'sse', points: -3, reason: 'Missed deadline for report submission' },
            { target: 'je', grantor: 'executive', points: 12, reason: 'Outstanding social media content creation' },
            { target: 'je', grantor: 'sse', points: 5, reason: 'Quick to respond to tasks' },
            { target: 'je', grantor: 'se', points: -2, reason: 'Late to last 2 events' },
            { target: 'os', grantor: 'president', points: 20, reason: 'Led successful tree plantation drive' },
            { target: 'js', grantor: 'president', points: 18, reason: 'Managed club finances efficiently' },
            { target: 'vp', grantor: 'president', points: 25, reason: 'Outstanding leadership during Eco Week' },
            { target: 'executive', grantor: 'os', points: 10, reason: 'Great teamwork during campus cleanup' },
            { target: 'sse', grantor: 'js', points: 7, reason: 'Helped prepare budget reports' },
            { target: 'se', grantor: 'sse', points: 4, reason: 'Volunteered for extra duties' },
            { target: 'je', grantor: 'os', points: -5, reason: 'Did not complete assigned tasks on time' },
            { target: 'executive', grantor: 'vp', points: 14, reason: 'Organized inter-club sports event' },
            { target: 'os', grantor: 'gs', points: 16, reason: 'Consistent contribution to planning committee' },
            { target: 'js', grantor: 'gs', points: 9, reason: 'Handled member registration smoothly' },
            { target: 'sse', grantor: 'vp', points: -4, reason: 'Incomplete social media report' },
        ];

        for (const entry of evolutionEntries) {
            const grantor = createdAdmins.find(a => a.username === entry.grantor);
            const target = createdAdmins.find(a => a.username === entry.target);
            if (grantor && target) {
                await Evolution.create({
                    targetId: target._id,
                    grantorId: grantor._id,
                    points: entry.points,
                    reason: entry.reason,
                });
            }
        }

        console.log(`\nSeeded ${evolutionEntries.length} evolution entries`);
        console.log('\n--- Login Credentials ---');
        console.log('All accounts use password: password123\n');
        createdAdmins.forEach(a => {
            console.log(`  ${a.username.padEnd(22)} | ${a.role}`);
        });

        console.log('\nSeed completed!');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seed();
