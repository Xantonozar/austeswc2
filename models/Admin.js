import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    role: {
        type: String,
        required: true,
        enum: [
            'superadmin', 'advisor', 'treasurer', 'president',
            'gs', 'vp', 'js', 'os', 'executive',
            'senior sub executive', 'sub executive', 'junior executive',
        ],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Admin;
}

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export default Admin;
