import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://meal:BlUntsfgPGpR2SkW@mymongo.rhcri.mongodb.net/austeswc?retryWrites=true&w=majority&appName=MyMongo';

const RoleHistorySchema = new mongoose.Schema({
    designation: { type: String },
    rankLevel: { type: Number },
    department: { type: String, default: null },
    semester: { type: String },
}, { _id: false });

const EvaluationSchema = new mongoose.Schema({
    date: { type: String },
    points: { type: Number },
    note: { type: String },
    evaluatorId: { type: String },
}, { _id: false });

const PanelMemberSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true, lowercase: true },
    password: String,
    designation: String,
    rankLevel: Number,
    department: { type: String, default: null },
    score: { type: Number, default: 0 },
    imageUrl: { type: String, default: '' },
    evaluationHistory: { type: [EvaluationSchema], default: [] },
    status: { type: String, enum: ['active', 'alumni', 'kicked'], default: 'active' },
    semesterJoined: { type: String, default: '' },
    semesterLeft: { type: String, default: '' },
    leftAt: { type: Date, default: null },
    roleHistory: { type: [RoleHistorySchema], default: [] },
}, { timestamps: true });

if (mongoose.models.PanelMember) delete mongoose.models.PanelMember;
const PanelMember = mongoose.model('PanelMember', PanelMemberSchema);

const dummyMembers = [
    // Core Council - rank >= 6
    { name: 'Dr. Sarah Mitchell', username: 'advisor1', designation: 'Advisor', rankLevel: 14, department: null, score: 0, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Arjun Mehta', username: 'treasurer1', designation: 'Treasurer', rankLevel: 13, department: null, score: 45, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Priya Sharma', username: 'president1', designation: 'President', rankLevel: 12, department: null, score: 120, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Rohan Gupta', username: 'vp1', designation: 'VP', rankLevel: 11, department: null, score: 95, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Ananya Patel', username: 'gs1', designation: 'GS', rankLevel: 10, department: null, score: 80, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Vikram Singh', username: 'ags1', designation: 'AGS', rankLevel: 9, department: null, score: 65, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Neha Reddy', username: 'js1', designation: 'JS', rankLevel: 8, department: null, score: 50, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Karthik Nair', username: 'os1', designation: 'OS', rankLevel: 7, department: null, score: 40, status: 'active', semesterJoined: 'Spring 2025' },

    // HODs - rank 6 (all 7 teams)
    { name: 'Deepak Verma', username: 'hod_pr1', designation: 'HOD', rankLevel: 6, department: 'Public Relationship', score: 55, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Meera Joshi', username: 'hod_cw1', designation: 'HOD', rankLevel: 6, department: 'Content Writing', score: 60, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Rahul Das', username: 'hod_em1', designation: 'HOD', rankLevel: 6, department: 'Event Management', score: 70, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Sneha Iyer', username: 'hod_wd1', designation: 'HOD', rankLevel: 6, department: 'Web Development', score: 48, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Amit Kumar', username: 'hod_log1', designation: 'HOD', rankLevel: 6, department: 'Logistics', score: 35, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Pallavi Ghosh', username: 'hod_rd1', designation: 'HOD', rankLevel: 6, department: 'Research & Development', score: 42, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Rajat Sen', username: 'hod_gfx1', designation: 'HOD', rankLevel: 6, department: 'Graphics', score: 38, status: 'active', semesterJoined: 'Spring 2025' },

    // ExecutiveDirector - rank 5
    { name: 'Tanvi Bose', username: 'execdir1', designation: 'ExecutiveDirector', rankLevel: 5, department: null, score: 30, status: 'active', semesterJoined: 'Fall 2024' },

    // Executives - rank 4 (all 7 teams)
    { name: 'Siddharth Rao', username: 'exec_pr1', designation: 'Executive', rankLevel: 4, department: 'Public Relationship', score: 25, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Ishita Agarwal', username: 'exec_cw1', designation: 'Executive', rankLevel: 4, department: 'Content Writing', score: 20, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Aditya Malhotra', username: 'exec_em1', designation: 'Executive', rankLevel: 4, department: 'Event Management', score: 15, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Pooja Menon', username: 'exec_wd1', designation: 'Executive', rankLevel: 4, department: 'Web Development', score: 18, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Karan Bhatia', username: 'exec_log1', designation: 'Executive', rankLevel: 4, department: 'Logistics', score: 12, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Nisha Roy', username: 'exec_rd1', designation: 'Executive', rankLevel: 4, department: 'Research & Development', score: 22, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Tanisha Paul', username: 'exec_gfx1', designation: 'Executive', rankLevel: 4, department: 'Graphics', score: 14, status: 'active', semesterJoined: 'Spring 2025' },

    // SubExecutives - rank 3 (all 7 teams)
    { name: 'Varun Chopra', username: 'subexec_pr1', designation: 'SubExecutive', rankLevel: 3, department: 'Public Relationship', score: 10, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Kavya Pillai', username: 'subexec_cw1', designation: 'SubExecutive', rankLevel: 3, department: 'Content Writing', score: 12, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Nikhil Sinha', username: 'subexec_em1', designation: 'SubExecutive', rankLevel: 3, department: 'Event Management', score: 8, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Ravi Teja', username: 'subexec_wd1', designation: 'SubExecutive', rankLevel: 3, department: 'Web Development', score: 9, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Sakshi Dubey', username: 'subexec_log1', designation: 'SubExecutive', rankLevel: 3, department: 'Logistics', score: 6, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Tanya Mehra', username: 'subexec_rd1', designation: 'SubExecutive', rankLevel: 3, department: 'Research & Development', score: 11, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Arpita Nanda', username: 'subexec_gfx1', designation: 'SubExecutive', rankLevel: 3, department: 'Graphics', score: 7, status: 'active', semesterJoined: 'Fall 2024' },

    // JuniorExecutives - rank 2 (all 7 teams)
    { name: 'Riya Banerjee', username: 'junexec_pr1', designation: 'JuniorExecutive', rankLevel: 2, department: 'Public Relationship', score: 5, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Tarun Goyal', username: 'junexec_cw1', designation: 'JuniorExecutive', rankLevel: 2, department: 'Content Writing', score: 3, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Harshita Jain', username: 'junexec_em1', designation: 'JuniorExecutive', rankLevel: 2, department: 'Event Management', score: 4, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Om Prakash', username: 'junexec_wd1', designation: 'JuniorExecutive', rankLevel: 2, department: 'Web Development', score: 2, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Meghna Das', username: 'junexec_log1', designation: 'JuniorExecutive', rankLevel: 2, department: 'Logistics', score: 4, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Saurabh Tiwari', username: 'junexec_rd1', designation: 'JuniorExecutive', rankLevel: 2, department: 'Research & Development', score: 3, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Diya Sharma', username: 'junexec_gfx1', designation: 'JuniorExecutive', rankLevel: 2, department: 'Graphics', score: 5, status: 'active', semesterJoined: 'Fall 2024' },

    // BatchAmbassadors - rank 1 (all 7 teams)
    { name: 'Aisha Khan', username: 'ba_pr1', designation: 'BatchAmbassador', rankLevel: 1, department: 'Public Relationship', score: 7, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Mohit Tiwari', username: 'ba_cw1', designation: 'BatchAmbassador', rankLevel: 1, department: 'Content Writing', score: 4, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Divya Raman', username: 'ba_em1', designation: 'BatchAmbassador', rankLevel: 1, department: 'Event Management', score: 6, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Aakash Gupta', username: 'ba_wd1', designation: 'BatchAmbassador', rankLevel: 1, department: 'Web Development', score: 3, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Nandini S', username: 'ba_log1', designation: 'BatchAmbassador', rankLevel: 1, department: 'Logistics', score: 5, status: 'active', semesterJoined: 'Fall 2024' },
    { name: 'Farhan Ali', username: 'ba_rd1', designation: 'BatchAmbassador', rankLevel: 1, department: 'Research & Development', score: 3, status: 'active', semesterJoined: 'Spring 2025' },
    { name: 'Priyanka Das', username: 'ba_gfx1', designation: 'BatchAmbassador', rankLevel: 1, department: 'Graphics', score: 4, status: 'active', semesterJoined: 'Fall 2024' },

    // Alumni
    { name: 'Sanjay Mishra', username: 'ex_president', designation: 'President', rankLevel: 12, department: null, score: 200, status: 'alumni', semesterJoined: 'Fall 2023', semesterLeft: 'Spring 2025', leftAt: new Date('2025-05-15'), roleHistory: [{ designation: 'VP', rankLevel: 11, department: null, semester: 'Fall 2023' }] },
    { name: 'Rina Das', username: 'ex_hod_pr', designation: 'HOD', rankLevel: 6, department: 'Public Relationship', score: 85, status: 'alumni', semesterJoined: 'Fall 2023', semesterLeft: 'Spring 2025', leftAt: new Date('2025-05-15'), roleHistory: [{ designation: 'Executive', rankLevel: 4, department: 'Public Relationship', semester: 'Fall 2023' }] },

    // Kicked (removed from club)
    { name: 'Ravi Shankar', username: 'kicked_exec', designation: 'Executive', rankLevel: 4, department: 'Logistics', score: 8, status: 'kicked', semesterJoined: 'Fall 2024', semesterLeft: 'Spring 2025', leftAt: new Date('2025-04-10'), leftReason: 'Inactivity', roleHistory: [] },
    { name: 'Preeti Chauhan', username: 'kicked_sub', designation: 'SubExecutive', rankLevel: 3, department: 'Graphics', score: 5, status: 'kicked', semesterJoined: 'Spring 2025', semesterLeft: 'Spring 2025', leftAt: new Date('2025-03-20'), leftReason: 'Policy violation', roleHistory: [] },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'austeswc' });
        console.log('Connected to MongoDB');

        // Clear existing panel members
        await PanelMember.deleteMany({});
        console.log('Cleared existing panel members');

        // Hash passwords and insert
        const salt = await bcrypt.genSalt(10);
        const hashedMembers = await Promise.all(
            dummyMembers.map(async (m) => ({
                ...m,
                password: await bcrypt.hash('password123', salt),
                evaluationHistory: [],
            }))
        );

        const result = await PanelMember.insertMany(hashedMembers);
        console.log(`Seeded ${result.length} panel members`);

        // Print summary
        const active = result.filter(m => m.status === 'active').length;
        const alumni = result.filter(m => m.status === 'alumni').length;
        console.log(`Active: ${active} | Alumni: ${alumni}`);
        console.log('Login credentials: username / password123');
        console.log('Loginable (rank >= 6): advisor1, treasurer1, president1, vp1, gs1, ags1, js1, os1, hod_pr1, hod_cw1, hod_em1, hod_wg1, hod_log1');

        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seed();
