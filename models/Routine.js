import mongoose from 'mongoose';

const RoutineSlotSchema = new mongoose.Schema({
    day: { type: String, required: true },
    time: { type: String, required: true },
    course: { type: String, default: '' },
    courseTitle: { type: String, default: '' },
    teacher: { type: String, default: '' },
    section: { type: String, default: '' },
}, { _id: false });

const RoutineSchema = new mongoose.Schema({
    dataCollectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DataCollect',
        required: true,
        unique: true,
    },
    studentId: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    department: {
        type: String,
        default: '',
    },
    labGroup: {
        type: String,
        default: '',
    },
    slots: [RoutineSlotSchema],
    extractedAt: {
        type: Date,
        default: Date.now,
    },
});

if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Routine;
}

const Routine = mongoose.models.Routine || mongoose.model('Routine', RoutineSchema);
export default Routine;
