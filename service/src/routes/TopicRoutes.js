import express from 'express';
import { createTopic, getAllTopics, getTopicById, updateTopic, deleteTopic } from '../controllers/TopicController.js';
import entryRouter from './EntryRoutes.js';
import topicUpload from '../middlewares/TopicUpload.js';

const router = express.Router();

router.route('/')
    .get(getAllTopics)
    .post(topicUpload, createTopic);

router.route('/:id')
    .get(getTopicById)
    .put(topicUpload, updateTopic) // Terapkan middleware untuk update juga
    .delete(deleteTopic);

router.use('/:topicId/entries', entryRouter);

export default router;