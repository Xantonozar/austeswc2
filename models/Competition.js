import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
    name: { type: String }, // For individual or team leader
    email: { type: String, required: true },
    phone: { type: String },

    // For team events
    teamName: { type: String },
    universityName: { type: String },
    members: [{
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        studentId: { type: String },
        universityName: { type: String },
        department: { type: String },
        semester: { type: String },
        photo: {
            url: { type: String },
            publicId: { type: String }
        }
    }],

    // For Eco Capture
    photos: [{
        url: { type: String },
        publicId: { type: String },
        story: { type: String },
        selected: { type: Boolean, default: false }
    }],

    // For Green Story
    videoLink: { type: String },

    // For Eco Pitch / Poster
    pdfUrl: { type: String },
    pdfPublicId: { type: String },
    trackCategory: { type: String, enum: ['Save Environment', 'Save People', 'Save Society', 'Other'] },
    posterTitle: { type: String },
    confirmAi: { type: Boolean, default: false },
    confirmRules: { type: Boolean, default: false },

    // Campus Ambassador Reference
    caReference: { type: String, default: '' },

    // Competition tracking
    type: {
        type: String,
        enum: ['eco-capture', 'eco-buzzers', 'green-story', 'eco-pitch', 'poster-presentation'],
        required: true
    },
    status: {
        type: String,
        enum: ['registered', 'selected', 'paid', 'eliminated', 'rejected'],
        default: 'registered'
    },
    round: {
        type: Number,
        default: 1
    },

    // Payment
    bkashTxId: { type: String },
    paymentMethod: { type: String, enum: ['bkash', 'nagad'], default: 'bkash' },
    paymentVerified: { type: Boolean, default: false },

    // Round 2 Payment
    bkashTxIdRound2: { type: String },
    paymentMethodRound2: { type: String, enum: ['bkash', 'nagad'], default: 'bkash' },
    paymentVerifiedRound2: { type: Boolean, default: false },
    paymentSenderNumber: { type: String },
    paymentScreenshotUrl: { type: String },
    paymentScreenshotPublicId: { type: String },
    paymentAmount: { type: Number },
    isClubMember: { type: Boolean, default: false },
    clubMemberId: { type: String },
    round2PosterTitle: { type: String },
    teamPhotos: [{
        url: { type: String },
        publicId: { type: String }
    }],

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Force recompilation of model in development to ensure schema changes are picked up
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Competition;
}

const Competition = mongoose.models.Competition || mongoose.model('Competition', MemberSchema);
export default Competition;

