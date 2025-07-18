import express from 'express';
import { addEntry, getEntriesByTopic, updateEntry, deleteEntry, getEntryById } from '../controllers/EntryController.js';
import VocabularyRouter from './VocabularyRoutes.js';
import entryUpload from '../middlewares/EntryUpload.js';
import updateUpload from '../middlewares/UpdateEntryUpload.js';
import { protect, admin } from '../middlewares/AuthMiddleware.js';

const router = express.Router({ mergeParams: true });

// Rute untuk /api/topics/:topicId/entries
router.route('/')
    .post(protect, entryUpload, addEntry)
    .get(getEntriesByTopic);

// Rute untuk /api/topics/:topicId/entries/:entryId
router.route('/:entryId')
    .get(getEntryById)
    .put(protect, admin, updateUpload, updateEntry) // Terapkan middleware upload untuk update
    .delete(protect, admin, deleteEntry);

// Rute untuk kosakata di dalam entri
router.use('/:entryId/vocabulary', VocabularyRouter);

export default router;