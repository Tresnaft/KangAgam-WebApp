import jwt from 'jsonwebtoken';
import Admin from '../models/AdminModel.js';

/**
 * Middleware untuk Autentikasi (Protect)
 * Memeriksa token JWT dan menempelkan data admin ke object request.
 */
const protect = async (req, res, next) => {
    let token;

    // 1. Baca token dari header 'Authorization'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Ekstrak token dari format 'Bearer <token>'
            token = req.headers.authorization.split(' ')[1];

            // 3. Verifikasi token menggunakan JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Ambil data admin dari database berdasarkan ID di dalam token
            //    Tempelkan data admin ke 'req' agar bisa diakses oleh rute selanjutnya
            req.admin = await Admin.findById(decoded.id).select('-adminPassword');

            // 5. Lanjutkan ke middleware atau controller berikutnya
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Akses ditolak, token tidak valid.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Akses ditolak, tidak ada token.' });
    }
};

/**
 * Middleware untuk Otorisasi (Admin Role)
 * Memeriksa apakah pengguna yang login memiliki peran sebagai admin atau superadmin.
 * HARUS dijalankan setelah middleware 'protect'.
 */
const admin = (req, res, next) => {
    // 'req.admin' sudah tersedia dari middleware 'protect'
    if (req.admin && (req.admin.role === 'admin' || req.admin.role === 'superadmin')) {
        next(); // Pengguna adalah admin, lanjutkan
    } else {
        res.status(403).json({ message: 'Akses ditolak, hanya untuk admin.' });
    }
};

/**
 * Middleware untuk Otorisasi (Superadmin Role)
 * Memeriksa apakah pengguna yang login memiliki peran sebagai superadmin.
 */
const superadmin = (req, res, next) => {
    if (req.admin && req.admin.role === 'superadmin') {
        next();
    } else {
        res.status(403).json({ message: 'Akses ditolak, hanya untuk superadmin.' });
    }
};


export { protect, admin, superadmin };