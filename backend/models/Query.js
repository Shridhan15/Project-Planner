import { response } from 'express';
import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    isResponded: {
        type: Boolean,
        default: false,
    },
    response: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Query = mongoose.model('Query', querySchema);
export default Query;
