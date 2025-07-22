import express from 'express';
import { getSettings, updateSettings } from '../controllers/SettingController.js';
import { protect, admin, superadmin } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Semua admin bisa melihat pengaturan
router.get('/', protect, admin, getSettings);
// Hanya superadmin yang bisa mengubah pengaturan
router.put('/', protect, superadmin, updateSettings);

export default router;