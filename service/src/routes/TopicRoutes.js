import express from 'express';
import { createTopic, getAllTopics, getTopicById, updateTopic, deleteTopic } from '../controllers/TopicController.js';
import entryRouter from './EntryRoutes.js';
import topicUpload from '../middlewares/TopicUpload.js';
import { protect, admin, superadmin } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getAllTopics)
    .post(protect, admin, topicUpload, createTopic);

router.route('/:id')
    .get(getTopicById)
    .put(protect, admin, topicUpload, updateTopic) // Terapkan middleware untuk update juga
    .delete(protect, admin, deleteTopic);

router.use('/:topicId/entries', entryRouter);

export default router;