import express from 'express';
import {
    createVisitorLog,
    getAllVisitorLogs,
    getVisitorStats
} from '../controllers/VisitorLogController.js';
// --- PERBAIKAN: Hapus import middleware karena tidak akan dipakai ---
// import { protect, admin } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Rute untuk membuat log baru dan mendapatkan semua log
router.route('/')
    .post(createVisitorLog)
    .get(getAllVisitorLogs); // Catatan: Endpoint ini bisa diproteksi jika diperlukan

// --- PERBAIKAN: Jadikan rute statistik ini publik ---
// Menghapus middleware 'protect' dan 'admin' dari sini
router.route('/stats')
    .get(getVisitorStats);

export default router;