import express from 'express';
import { createTopic, getAllTopics, getTopicById, updateTopic, deleteTopic } from '../controllers/TopicController.js';
import entryRouter from './EntryRoutes.js';

const router = express.Router();


// ==================================
// RUTE UNTUK TOPIC
// ==================================
// Rute: /api/topics
router.route('/')
    .get(getAllTopics)
    .post(createTopic);

// Rute: /api/topics/:id
router.route('/:id')
    .get(getTopicById)
    .put(updateTopic) // Anda bisa menggunakan PUT atau PATCH
    .delete(deleteTopic);

// ==================================
// PENERUSAN RUTE (FORWARDING)
// ==================================
// Untuk setiap rute yang cocok dengan pola /:topicId/entries,
// teruskan request tersebut ke entryRouter.
router.use('/:topicId/entries', entryRouter);

export default router;
