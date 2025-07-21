import express from 'express';
import {
    createVisitorLog,
    getAllVisitorLogs,
    getVisitorStats
} from '../controllers/VisitorLogController.js';

const router = express.Router();

// Rute untuk membuat log baru dan mendapatkan semua log
router.route('/')
    .post(createVisitorLog)
    .get(getAllVisitorLogs);

router.route('/stats')
    .get(getVisitorStats);

export default router;