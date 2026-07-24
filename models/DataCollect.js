import mongoose from 'mongoose';

const DataCollectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
        trim: true,
    },
    imageUrl: {
        type: String,
        required: [true, 'Profile image is required'],
    },
    publicId: String,
    yearSemester: {
        type: String,
        required: [true, 'Please provide year and semester'],
    },
    labGroup: {
        type: String,
        trim: true,
    },
    department: {
        type: String,
        required: [true, 'Please provide a department'],
    },
    team: {
        type: String,
        trim: true,
    },
    position: {
        type: String,
        trim: true,
    },
    studentId: {
        type: String,
        required: [true, 'Please provide a student ID'],
        unique: true,
        trim: true,
        uppercase: true,
    },
    routineImageUrl: String,
    routinePublicId: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.DataCollect;
}

const DataCollect = mongoose.models.DataCollect || mongoose.model('DataCollect', DataCollectSchema);
export default DataCollect;
