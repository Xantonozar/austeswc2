import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    studentId: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: String, required: true },
    section: { type: String },
    role: { 
        type: String, 
        required: true,
        enum: ['Junior Executive', 'Sub Executive']
    },
    experience: { type: String }, // Optional
    fbLink: { type: String, required: true },
    isOtherClubExecutive: { type: String, enum: ['Yes', 'No'], default: 'No' },
    teamPreferences: { 
        type: [String], 
        validate: [v => v && v.length >= 3 && v.length <= 7, 'Must select at least 3 teams']
    },
    skillHelp: { type: String, required: true },
    imageUrl: { type: String, required: true }, // Mandatory uploaded photo URL
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Force recompilation of model in development to ensure schema changes are picked up
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Application;
}

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
export default Application;
