import VisitorLog from '../models/VisitorLogModel.js';
import mongoose from 'mongoose';

/**
 * @desc    Mencatat (Create) kunjungan baru
 * @route   POST /api/visitor-logs
 * @access  Public (dipanggil oleh frontend saat learner mengunjungi topik)
 */
export const createVisitorLog = async (req, res) => {
    try {
        // Ambil ID learner dan ID topik dari body request
        const { learnerId, topicId } = req.body;

        // Validasi input
        if (!learnerId || !topicId) {
            return res.status(400).json({ message: 'ID Learner dan ID Topik harus disertakan.' });
        }
        
        // Buat entri log baru
        const newLog = await VisitorLog.create({
            learner: learnerId,
            topic: topicId,
            // timestamp akan otomatis ditambahkan oleh model
        });

        res.status(201).json({
            message: 'Kunjungan berhasil dicatat.',
            data: newLog
        });

    } catch (error) {
        res.status(500).json({ message: 'Gagal mencatat kunjungan.', error: error.message });
    }
};

/**
 * @desc    Mendapatkan (Read) semua data log kunjungan
 * @route   GET /api/visitor-logs
 * @access  Private/Admin (untuk keperluan statistik)
 */
export const getAllVisitorLogs = async (req, res) => {
    try {
        const logs = await VisitorLog.find({})
            // Mengisi data learner & topik agar lebih informatif
            .populate('learner', 'learnerName')
            // .populate('topic', 'topicName')
            // Urutkan berdasarkan yang paling baru
            .sort({ timestamp: -1 });

        res.status(200).json({
            message: 'Berhasil mengambil semua log kunjungan.',
            count: logs.length,
            data: logs
        });

    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data log.', error: error.message });
    }
};