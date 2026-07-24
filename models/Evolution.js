import mongoose from 'mongoose';

const EvolutionSchema = new mongoose.Schema({
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    grantorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Evolution;
}

const Evolution = mongoose.models.Evolution || mongoose.model('Evolution', EvolutionSchema);
export default Evolution;
