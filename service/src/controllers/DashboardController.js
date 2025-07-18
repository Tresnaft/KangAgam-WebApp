import VisitorLog from '../models/VisitorLogModel.js';
import Learner from '../models/LearnerModel.js';
import Topic from '../models/TopicModel.js';
import mongoose from 'mongoose';

/**
 * @desc    Mengambil semua data statistik untuk dashboard admin
 * @route   GET /api/dashboard/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res) => {
    try {
        // --- 1. Ambil parameter filter yang lebih spesifik ---
        const { visitorsPeriod, institutionPeriod, topicMonth } = req.query;

        // --- 2. Buat filter untuk setiap statistik secara terpisah ---
        const visitorsDateFilter = createDateFilter(visitorsPeriod);
        const institutionDateFilter = createDateFilter(institutionPeriod);

        // --- 3. Kalkulasi Statistik ---

        // A. Total Kunjungan Pengguna (menggunakan filter 'visitorsPeriod')
        const totalVisitors = await VisitorLog.countDocuments(visitorsDateFilter);

        // B. Topik Favorit (menggunakan filter 'topicMonth')
        let topicMatchCriteria = {};
        if (topicMonth) { // format: YYYY-MM, misal: 2025-08
            const year = parseInt(topicMonth.split('-')[0]);
            const month = parseInt(topicMonth.split('-')[1]);
            const topicStartDate = new Date(year, month - 1, 1);
            const topicEndDate = new Date(year, month, 0, 23, 59, 59);
            topicMatchCriteria = { timestamp: { $gte: topicStartDate, $lte: topicEndDate } };
        }
        
        const topicVisitDistribution = await VisitorLog.aggregate([
            { $match: topicMatchCriteria },
            { $group: { _id: "$topic", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $lookup: { from: "topics", localField: "_id", foreignField: "_id", as: "topicDetails" } },
            { $unwind: "$topicDetails" },
            { $project: { _id: 0, topicId: "$_id", name: "$topicDetails.topicName", count: "$count" } }
        ]);

        // C. Asal Instansi Terbanyak (menggunakan filter 'institutionPeriod')
        const mostFrequentInstitution = await VisitorLog.aggregate([
            // Langkah 1: Filter log kunjungan berdasarkan periode yang dipilih
            // (Tahap ini tetap sama)
            { $match: institutionDateFilter },

            // Langkah 2: Kelompokkan berdasarkan ID learner untuk mendapatkan pengunjung unik
            // Ini adalah langkah kunci yang baru. Sekarang setiap learner hanya akan muncul sekali.
            {
                $group: {
                    _id: "$learner" // Mengelompokkan semua log berdasarkan ID learner
                }
            },

            // Langkah 3: Ambil detail untuk setiap learner unik tersebut
            // Kita ganti 'localField' menjadi '_id' karena hasil dari $group adalah _id
            { 
                $lookup: {
                    from: "learners",
                    localField: "_id", // <-- Perubahan di sini
                    foreignField: "_id",
                    as: "learnerDetails"
                }
            },
            
            // Langkah 4: Unwind data learner
            { $unwind: "$learnerDetails" },

            // Langkah 5: Sekarang, kelompokkan berdasarkan institusi dari learner unik
            { 
                $group: {
                    _id: { $toLower: "$learnerDetails.learnerInstitution" },
                    uniqueVisitorCount: { $sum: 1 } // Hitung jumlah PENGUNJUNG unik per institusi
                }
            },
            
            // Langkah 6 & 7: Urutkan dan ambil yang teratas (tetap sama)
            { $sort: { uniqueVisitorCount: -1 } },
            { $limit: 1 },

            // Langkah 8: Format output
            { 
                $project: {
                    _id: 0,
                    name: "$_id",
                    count: "$uniqueVisitorCount" // Ganti nama field agar sesuai
                }
            }
        ]);

        res.status(200).json({
            totalVisitors,
            favoriteTopic: topicVisitDistribution[0] || {},
            mostFrequentInstitution: mostFrequentInstitution[0] || {},
        });

    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data statistik.', error: error.message });
    }
};

const createDateFilter = (period) => {
    const today = new Date();
    let startDate, endDate;

    switch (period) {
        case 'daily':
            startDate = new Date(today.setHours(0, 0, 0, 0));
            endDate = new Date(today.setHours(23, 59, 59, 999));
            return { timestamp: { $gte: startDate, $lte: endDate } };
        case 'monthly':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
            return { timestamp: { $gte: startDate, $lte: endDate } };
        case 'yearly':
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
            return { timestamp: { $gte: startDate, $lte: endDate } };
        default:
            return {}; // Jika tidak ada filter, kembalikan objek kosong
    }
};

