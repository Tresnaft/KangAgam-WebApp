import express from 'express';
import {
    createLanguage,
    getAllLanguages,
    deleteLanguage
} from '../controllers/LanguageController.js';
import { protect, admin } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// ==================================
// RUTE UNTUK BAHASA (LANGUAGES)
// ==================================

// Rute: /api/languages
// GET akan mengambil semua bahasa.
// POST akan membuat bahasa baru.
router.route('/')
    .get(getAllLanguages)
    .post(protect, admin, createLanguage);

// Rute: /api/languages/:id
// DELETE akan menghapus bahasa berdasarkan ID-nya.
router.route('/:id')
    .delete(protect, admin, deleteLanguage);

export default router;