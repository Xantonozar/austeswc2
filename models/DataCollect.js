import mongoose from 'mongoose';

const advTreasPositions = ['Advisor', 'Treasurer'];

const DataCollectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: function () {
            return !advTreasPositions.includes(this.position);
        },
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: function () {
            return !advTreasPositions.includes(this.position);
        },
        trim: true,
    },
    imageUrl: {
        type: String,
        required: [true, 'Profile image is required'],
    },
    publicId: String,
    yearSemester: {
        type: String,
        required: function () {
            return !advTreasPositions.includes(this.position);
        },
    },
    labGroup: {
        type: String,
        trim: true,
    },
    department: {
        type: String,
        required: function () {
            return !advTreasPositions.includes(this.position);
        },
    },
    team: {
        type: String,
        trim: true,
    },
    position: {
        type: String,
        required: [true, 'Please provide a position'],
        trim: true,
    },
    studentId: {
        type: String,
        required: function () {
            return !advTreasPositions.includes(this.position);
        },
        trim: true,
        uppercase: true,
    },
    routineImageUrl: {
        type: String,
        required: function () {
            return !advTreasPositions.includes(this.position);
        },
    },
    routinePublicId: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

DataCollectSchema.index({ studentId: 1 }, { unique: true, sparse: true, partialFilterExpression: { studentId: { $exists: true, $ne: '' } } });

if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.DataCollect;
}

const DataCollect = mongoose.models.DataCollect || mongoose.model('DataCollect', DataCollectSchema);
export default DataCollect;
