import express from 'express';
import { addEntry, getEntriesByTopic, updateEntry, deleteEntry, getEntryById } from '../controllers/EntryController.js';
import VocabularyRouter from './VocabularyRoutes.js';
import entryUpload from '../middlewares/EntryUpload.js';

// PENTING: { mergeParams: true } memungkinkan router ini untuk mengakses
// parameter dari router induk, dalam hal ini :topicId dari topicRoutes.
const router = express.Router({ mergeParams: true });

// ==================================
// RUTE UNTUK ENTRI
// ==================================
// Catatan: Path di sini relatif terhadap /api/topics/:topicId/entries

// Rute: /
// Ini akan cocok dengan POST /api/topics/:topicId/entries
// dan GET /api/topics/:topicId/entries
router.route('/')
    .post(entryUpload, addEntry)
    .get(getEntriesByTopic);

// Rute: /:entryId
// Ini akan cocok dengan PUT /api/topics/:topicId/entries/:entryId
// dan DELETE /api/topics/:topicId/entries/:entryId
router.route('/:entryId')
    .put(updateEntry)
    .delete(deleteEntry)
    .get(getEntryById);

router.use('/:entryId/vocabulary', VocabularyRouter);

export default router;
