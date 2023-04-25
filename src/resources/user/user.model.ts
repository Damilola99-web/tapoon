import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '@/resources/user/user.interface';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

userSchema.pre<User>('save', async function (next) {
    try {
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        }
        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function (password: string): Promise<Error | boolean> {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error: any) {
        throw new Error(error);
    }
}

export default model<User>('User', userSchema);