import mongoose from 'mongoose';

const EvaluationSchema = new mongoose.Schema({
    date: { type: String, required: true },
    points: { type: Number, required: true },
    note: { type: String, required: true },
    evaluatorId: { type: String, required: true },
}, { _id: false });

const PanelMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    designation: {
        type: String,
        required: [true, 'Please provide a designation'],
    },
    rankLevel: {
        type: Number,
        required: [true, 'Please provide a rank level'],
    },
    department: {
        type: String,
        default: null,
    },
    score: {
        type: Number,
        default: 0,
    },
    imageUrl: {
        type: String,
        default: '',
    },
    evaluationHistory: {
        type: [EvaluationSchema],
        default: [],
    },
}, {
    timestamps: true,
});

// Force recompilation in development
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.PanelMember;
}

const PanelMember = mongoose.models.PanelMember || mongoose.model('PanelMember', PanelMemberSchema);
export default PanelMember;
