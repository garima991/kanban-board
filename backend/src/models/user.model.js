import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
    },
    username : {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Username must be at least 5 characters long'],
        // add more validation rules
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long' ],
        // add more validation rules
    },
    role:{
        type: String,
        enum: ['admin', 'member'],
        default: 'member',
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);