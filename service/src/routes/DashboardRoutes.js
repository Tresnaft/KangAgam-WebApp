import express from 'express';
import { getDashboardStats } from '../controllers/DashboardController.js';
import { protect, admin } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Rute utama untuk mendapatkan semua statistik dashboard
// Sebaiknya rute ini dilindungi agar hanya bisa diakses oleh admin.
router.route('/stats').get(protect, admin, getDashboardStats);

export default router;