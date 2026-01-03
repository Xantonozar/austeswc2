
import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
        trim: true,
    },
    department: {
        type: String,
        required: [true, 'Please provide a department'],
    },
    yearSemester: {
        type: String,
        required: [true, 'Please provide a year and semester'],
    },
    labGroup: {
        type: String,
        required: function () {
            return this.department !== 'BBA';
        },
    },
    studentId: {
        type: String,
        required: [true, 'Please provide a student ID'],
        unique: true,
        trim: true,
        uppercase: true,
    },
    bkashId: {
        type: String,
        trim: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Online'],
        default: 'Online',
        required: true,
    },
    paymentScreenshot: {
        type: String,
    },
    paymentScreenshotName: String,
    paymentScreenshotType: String,
    reference: {
        type: String,
        trim: true,
    },
    imageUrl: {
        type: String,
        required: [true, 'Profile photo is required']
    },
    publicId: String,
    imageName: String,
    agreeToTerms: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Force recompilation of model in development to ensure schema changes are picked up
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Member;
}

const Member = mongoose.models.Member || mongoose.model('Member', MemberSchema);
export default Member;
