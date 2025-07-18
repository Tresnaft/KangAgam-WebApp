import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    adminName: {
        type: String,
        required: [true, 'Nama tidak boleh kosong'],
        trim: true,
        minlength: 3,
        maxlength: 55,
    },
    adminEmail: {
        type: String,
        required: [true, 'Email tidak boleh kosong'],
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Masukkan email yang valid'],
    },
    adminPassword: {
        type: String,
        required: [true, 'Kata sandi tidak boleh kosong'],
        trim: true,
        minlength: 8,
        select: false, 
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'], 
        default: 'admin'              
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
});


// Hashing password sebelum menyimpan ke database
AdminSchema.pre('save', async function(next) {
    if (this.isModified('adminPassword')) {
        const salt = await bcrypt.genSalt(10);
        this.adminPassword = await bcrypt.hash(this.adminPassword, salt);
    }
    next();
});

// Method untuk membandingkan password
AdminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.adminPassword);
}

// Method untuk mengatur token reset password
AdminSchema.methods.setPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // Token berlaku selama 30 menit
    return resetToken;
}

export default mongoose.model('Admin', AdminSchema);