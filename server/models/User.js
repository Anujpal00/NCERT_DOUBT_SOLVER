import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    classLevel: { type: Number, required: true, min: 5, max: 12 },
    subjects: { type: [String], default: [] },
    history: [{
        question: String,
        answer: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);