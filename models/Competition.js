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
        studentId: { type: String }
    }],

    // For Eco Capture
    photos: [{
        url: { type: String },
        publicId: { type: String },
        story: { type: String }
    }],

    // For Green Story
    videoLink: { type: String },

    // For Eco Pitch
    pdfUrl: { type: String },
    pdfPublicId: { type: String },

    // Campus Ambassador Reference
    caReference: { type: String, default: '' },

    // Competition tracking
    type: {
        type: String,
        enum: ['eco-capture', 'eco-buzzers', 'green-story', 'eco-pitch'],
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

