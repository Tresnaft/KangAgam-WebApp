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

/**
 * @desc    Mendapatkan statistik pengunjung
 * @route   GET /api/visitor-logs/stats
 * @access  Private/Admin
 */
export const getVisitorStats = async (req, res) => {
    try {
        // 1. Menghitung Total Pengunjung Unik
        // Kita kelompokkan berdasarkan learner, lalu kita hitung hasilnya.
        const totalUniqueVisitors = await VisitorLog.aggregate([
            { $group: { _id: '$learner' } }, // Mengumpulkan ID learner yang unik
            { $count: 'total' }              // Menghitung jumlah ID unik tersebut
        ]);

        // 2. Menghitung Jumlah Pengunjung Unik per Topik
        const visitorsPerTopic = await VisitorLog.aggregate([
            // Langkah A: Dapatkan kombinasi unik dari topik dan learner
            { 
                $group: { 
                    _id: { topic: '$topic', learner: '$learner' } 
                } 
            },
            // Langkah B: Sekarang, kelompokkan berdasarkan topik dan hitung learner uniknya
            {
                $group: {
                    _id: '$_id.topic',
                    uniqueVisitors: { $sum: 1 }
                }
            },
            // Langkah C: Ambil detail nama topik dari koleksi 'topics'
            {
                $lookup: {
                    from: 'topics',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'topicDetails'
                }
            },
            // Langkah D: Rapikan outputnya
            { $unwind: '$topicDetails' },
            {
                $project: {
                    _id: 0,
                    topic: {
                        id: '$_id'
                    },
                    uniqueVisitorCount: '$uniqueVisitors'
                }
            },
            { $sort: { uniqueVisitorCount: -1 } } // Urutkan dari yang paling populer
        ]);

        res.status(200).json({
            message: 'Berhasil mengambil statistik pengunjung.',
            // Ambil hasil atau default ke 0 jika tidak ada pengunjung
            totalUniqueVisitors: totalUniqueVisitors[0]?.total || 0,
            visitorsPerTopic: visitorsPerTopic
        });

    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data statistik.', error: error.message });
    }
};