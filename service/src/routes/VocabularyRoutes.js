import express from 'express';
import { addVocabulary, getVocabulariesByLanguage } from '../controllers/VocabularyController.js';

const router = express.Router({ mergeParams: true });
// ==================================
// RUTE UNTUK KOSAKATA (VOCABULARY)
// ==================================
// Rute: /api/topics/:topicId/entries/:entryId/vocabulary
// POST akan menambahkan kosakata baru ke entri tertentu.
router.route('/')
    .post(addVocabulary);
    

export default router