import VisitorLog from '../models/VisitorLogModel.js';
import Learner from '../models/LearnerModel.js';
import Topic from '../models/TopicModel.js';
import mongoose from 'mongoose';

const createDateFilter = (period) => {
    const today = new Date();
    let startDate, endDate;

    switch (period) {
        case 'daily':
            startDate = new Date(today.setHours(0, 0, 0, 0));
            endDate = new Date(new Date().setHours(23, 59, 59, 999));
            return { timestamp: { $gte: startDate, $lte: endDate } };
        case 'weekly':
             const dayOfWeek = today.getDay(); // 0=Minggu, 1=Senin
             startDate = new Date(today);
             startDate.setDate(today.getDate() - dayOfWeek);
             startDate.setHours(0, 0, 0, 0);
             endDate = new Date();
             endDate.setHours(23, 59, 59, 999);
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
            return {};
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const { visitorsPeriod, cityPeriod, topicPeriod } = req.query;

        const visitorsDateFilter = createDateFilter(visitorsPeriod);
        const cityDateFilter = createDateFilter(cityPeriod);
        const topicDateFilter = createDateFilter(topicPeriod);
        
        const totalVisitors = await VisitorLog.countDocuments(visitorsDateFilter);

        // 1. Kalkulasi data untuk grafik kunjungan
        const visitorDistribution = await VisitorLog.aggregate([
            { $match: visitorsDateFilter },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } },
            { $project: { _id: 0, label: "$_id", count: "$count" } }
        ]);

        // 2. Kalkulasi data untuk grafik topik
        const topicVisitDistribution = await VisitorLog.aggregate([
            { $match: topicDateFilter },
            { $group: { _id: "$topic", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $lookup: { from: "topics", localField: "_id", foreignField: "_id", as: "topicDetails" } },
            { $unwind: "$topicDetails" },
            { $project: { _id: 0, topicId: "$_id", name: "$topicDetails.topicName", count: "$count" } }
        ]);

        const mostFrequentcity = await VisitorLog.aggregate([
            { $match: cityDateFilter },
            { $group: { _id: "$learner" } },
            { $lookup: { from: "learners", localField: "_id", foreignField: "_id", as: "learnerDetails" } },
            { $unwind: "$learnerDetails" },
            { 
                $group: {
                    _id: { $toLower: "$learnerDetails.learnerCity" },
                    uniqueVisitorCount: { $sum: 1 }
                }
            },
            { $sort: { uniqueVisitorCount: -1 } },
            { $limit: 1 },
            { 
                $project: {
                    _id: 0,
                    name: "$_id",
                    count: "$uniqueVisitorCount"
                }
            }
        ]);

        // 3. Sertakan semua data dalam respons JSON
        res.status(200).json({
            totalVisitors,
            visitorDistribution, // <-- Kirim data ini
            favoriteTopic: topicVisitDistribution[0] || {},
            topicDistribution: topicVisitDistribution, // <-- Kirim data ini
            mostfrequentcity: mostFrequentcity[0] || {},
        });

    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data statistik.', error: error.message });
    }
};