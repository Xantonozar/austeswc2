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
        enum: ['Batch Ambassador', 'Junior Executive', 'Sub Executive']
    },
    motivation: { type: String, required: true },
    experience: { type: String, required: true },
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
