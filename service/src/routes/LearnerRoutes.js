import express from 'express';
import {
    createLearner,
    getAllLearners,
    getLearnerById,
    updateLearner,
    deleteLearner
} from '../controllers/LearnerController.js';

const router = express.Router();

// Rute untuk membuat learner baru dan mendapatkan semua learner
router.route('/')
    .post(createLearner)
    .get(getAllLearners);

// Rute untuk mendapatkan, mengupdate, dan menghapus learner berdasarkan ID
router.route('/:id')
    .get(getLearnerById)
    .put(updateLearner)
    .delete(deleteLearner);

export default router;