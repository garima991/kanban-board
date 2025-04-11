import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    username : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [5, 'Username must be at least 5 characters long'],
        // add more validation rules
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        // add more validation rules
    },
    role:{
        type: String,
        enum: ['admin', 'member'],
        default: 'member',
    },
    refreshToken : {
        type: String,
    }
}, { timestamps: true });



userSchema.pre('save', async function(next) {
    if (!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(givenPassword) {
    return await bcrypt.compare(givenPassword, this.password);
};

userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME }
    )
};

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name,
            role: this.role,
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME }
    )
};
 

export const User = mongoose.model('User', userSchema);