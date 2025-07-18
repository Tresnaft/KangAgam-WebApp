import express from 'express';
import {
    createVisitorLog,
    getAllVisitorLogs
} from '../controllers/VisitorLogController.js';

const router = express.Router();

// Rute untuk membuat log baru dan mendapatkan semua log
router.route('/')
    .post(createVisitorLog)
    .get(getAllVisitorLogs);

export default router;