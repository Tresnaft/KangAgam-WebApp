import Admin from '../models/AdminModel.js';
import jwt from 'jsonwebtoken'; // Diperlukan untuk login (install: npm i jsonwebtoken)
import crypto from 'crypto';
import sendEmail from '../utils/SendEmail.js';
import mongoose from 'mongoose';

// Fungsi helper untuk generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * @desc    Login Admin
 * @route   POST /api/admins/login
 */
export const loginAdmin = async (req, res) => {
    try {
        const { adminEmail, adminPassword } = req.body;
        if (!adminEmail || !adminPassword) {
            return res.status(400).json({ message: "Email dan password harus diisi." });
        }

        const admin = await Admin.findOne({ adminEmail }).select('+adminPassword');

        if (admin && (await admin.comparePassword(adminPassword))) {
            res.status(200).json({
                message: "Login berhasil.",
                _id: admin._id,
                adminName: admin.adminName,
                adminEmail: admin.adminEmail,
                token: generateToken(admin._id),
            });
        } else {
            res.status(401).json({ message: "Email atau password salah." });
        }
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat login.", error: error.message });
    }
};


/**
 * @desc    Membuat (Create) admin baru (Registrasi)
 * @route   POST /api/admins
 */
export const createAdmin = async (req, res) => {
    try {
        console.log(req.headers['content-type']);
        console.log("Creating admin with body:", req.body);
        const { adminName, adminEmail, adminPassword } = req.body;

        const adminExists = await Admin.findOne({ adminEmail });
        if (adminExists) {
            return res.status(400).json({ message: "Admin dengan email ini sudah terdaftar." });
        }

        const admin = await Admin.create({ adminName, adminEmail, adminPassword });

        if (admin) {
            res.status(201).json({
                message: "Admin berhasil dibuat.",
                _id: admin._id,
                adminName: admin.adminName,
                adminEmail: admin.adminEmail,
                token: generateToken(admin._id),
            });
        } else {
            throw new Error("Data admin tidak valid.");
        }
    } catch (error) {
        res.status(500).json({ message: "Gagal membuat admin.", error: error.message });
    }
};

/**
 * @desc    Mendapatkan (Read) semua admin
 * @route   GET /api/admins
 */
export const getAllAdmins = async (req, res) => {
    try {
        // Ambil semua admin tanpa password mereka
        const admins = await Admin.find({}).select('-adminPassword');
        res.status(200).json({ count: admins.length, data: admins });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data admin.", error: error.message });
    }
};

/**
 * @desc    Memperbarui (Update) data admin
 * @route   PUT /api/admins/:id
 */
export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminName, adminEmail } = req.body;

        const admin = await Admin.findById(id);

        if (admin) {
            admin.adminName = adminName || admin.adminName;
            admin.adminEmail = adminEmail || admin.adminEmail;
            
            // Password tidak diupdate di sini untuk keamanan.
            // Buat fungsi terpisah 'changePassword' jika diperlukan.

            const updatedAdmin = await admin.save();
            res.status(200).json({ message: "Admin berhasil diperbarui.", data: updatedAdmin });
        } else {
            res.status(404).json({ message: "Admin tidak ditemukan." });
        }
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui admin.", error: error.message });
    }
};

/**
 * @desc    Menghapus (Delete) admin
 * @route   DELETE /api/admins/:id
 */
export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findByIdAndDelete(id);

        if (!admin) {
            return res.status(404).json({ message: "Admin tidak ditemukan." });
        }

        res.status(200).json({ message: "Admin berhasil dihapus." });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus admin.", error: error.message });
    }
};

/**
 * @desc Mengganti password admin
 * @route PUT /api/admins/:id/change-password
 * @access Private/Admin
 * @param {string} id - ID admin yang ingin diubah passwordnya
 * @param {string} oldPassword - Password lama
 * @param {string} newPassword - Password baru  
 */
export const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old password and new password are required." });
        }

        const admin = await Admin.findById(id).select('+adminPassword');

        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        const isMatch = await admin.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect." });
        }

        admin.adminPassword = newPassword; // Password akan di-hash otomatis oleh middleware 'pre' pada model
        await admin.save();

        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to change password.", error: error.message });
    }
};

/**
 * @desc    Admin lupa kata sandi (minta token reset)
 * @route   POST /api/admin/forgot-password
 */
export const forgotPassword = async (req, res) => {
    // 1. Cari admin berdasarkan email
    const admin = await Admin.findOne({ adminEmail: req.body.adminEmail });
    try {

        if (!admin) {
            // Untuk keamanan, kita tidak memberitahu bahwa email tidak terdaftar.
            return res.status(200).json({ message: 'Jika email terdaftar, link reset akan dikirim.' });
        }

        // 2. Generate token reset (dari method yang sudah ada di model)
        const resetToken = admin.setPasswordResetToken();
        await admin.save({ validateBeforeSave: false }); // Simpan token & expiry date ke DB

        // 3. Buat URL reset
        // Ganti 'http://localhost:3000' dengan URL frontend Anda
        const resetURL = `${req.protocol}://localhost:3000/reset-password/${resetToken}`;

        const message = `Anda menerima email ini karena Anda (atau orang lain) meminta untuk mereset kata sandi Anda. Silakan klik link di bawah untuk melanjutkan:\n\n${resetURL}\n\nJika Anda tidak merasa meminta ini, abaikan saja email ini. Token ini akan hangus dalam 30 menit.`;

        // 4. Kirim email
        await sendEmail({
            email: admin.adminEmail,
            subject: 'Reset Kata Sandi Akun Admin Kang Agam',
            message,
        });

        res.status(200).json({
            message: 'Link reset kata sandi telah dikirim ke email Anda.',
        });

    } catch (error) {
        // Jika terjadi error, hapus token di DB agar tidak menggantung
        if (admin) {
            admin.passwordResetToken = undefined;
            admin.passwordResetExpires = undefined;
            await admin.save({ validateBeforeSave: false });
        }
        res.status(500).json({ message: 'Gagal mengirim email.', error: error.message });
    }
};

/**
 * @desc    Reset kata sandi dengan token
 * @route   PUT /api/admins/reset-password/:token
 */
export const resetPassword = async (req, res) => {
    try {
        // 1. Dapatkan token dari URL dan hash kembali untuk dicocokkan dengan DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // 2. Cari admin dengan token yang cocok dan belum hangus
        const admin = await Admin.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }, // Cek apakah belum expired
        });

        if (!admin) {
            return res.status(400).json({ message: 'Token tidak valid atau sudah hangus.' });
        }

        // 3. Set kata sandi baru dan hapus token reset
        admin.adminPassword = req.body.password;
        admin.passwordResetToken = undefined;
        admin.passwordResetExpires = undefined;
        await admin.save(); // pre-save hook di model akan otomatis hash password baru

        // 4. Kirim token login baru sebagai konfirmasi
        const token = generateToken(admin._id);
        res.status(200).json({
            message: 'Kata sandi berhasil direset.',
            token,
        });

    } catch (error) {
        res.status(500).json({ message: 'Gagal mereset kata sandi.', error: error.message });
    }
};