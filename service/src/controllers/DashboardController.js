import VisitorLog from '../models/VisitorLogModel.js';
import Learner from '../models/LearnerModel.js';
import Topic from '../models/TopicModel.js';
import Admin from '../models/AdminModel.js';
import mongoose from 'mongoose';

const createDateFilter = (period) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let startDate;

    switch (period) {
        case 'daily':
            startDate = new Date(today);
            break;
        case 'weekly':
            const dayOfWeek = today.getDay();
            startDate = new Date(today);
            startDate.setDate(today.getDate() - dayOfWeek);
            break;
        case 'monthly':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            break;
        case 'yearly':
            startDate = new Date(today.getFullYear(), 0, 1);
            break;
        default:
            return {};
    }
    
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    return { timestamp: { $gte: startDate, $lte: endDate } };
};

export const getDashboardStats = async (req, res) => {
    try {
        const { visitorsPeriod, cityPeriod, topicPeriod } = req.query;

        const visitorsDateFilter = createDateFilter(visitorsPeriod);
        const cityDateFilter = createDateFilter(cityPeriod);
        const topicDateFilter = createDateFilter(topicPeriod);
        
        const [
            totalVisitors,
            totalUniqueVisitorsResult,
            visitorDistribution,
            // ✅ Menambahkan agregasi untuk distribusi pengunjung unik
            uniqueVisitorDistribution,
            topicVisitDistribution,
            // ✅ Mengubah agregasi untuk mendapatkan 5 domisili teratas
            cityDistribution,
            totalTopics,
            totalAdmins
        ] = await Promise.all([
            VisitorLog.countDocuments(visitorsDateFilter),
            VisitorLog.aggregate([
                { $match: visitorsDateFilter },
                { $group: { _id: "$learner" } },
                { $count: "count" }
            ]),
            VisitorLog.aggregate([
                { $match: visitorsDateFilter },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, count: { $sum: 1 } } },
                { $sort: { "_id": 1 } },
                { $project: { _id: 0, label: "$_id", count: "$count" } }
            ]),
            // Agregasi baru untuk distribusi pengunjung unik per hari
            VisitorLog.aggregate([
                { $match: visitorsDateFilter },
                { $group: { _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, learner: "$learner" } } },
                { $group: { _id: "$_id.date", count: { $sum: 1 } } },
                { $sort: { "_id": 1 } },
                { $project: { _id: 0, label: "$_id", count: "$count" } }
            ]),
            VisitorLog.aggregate([
                { $match: topicDateFilter },
                { $group: { _id: "$topic", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $lookup: { from: "topics", localField: "_id", foreignField: "_id", as: "topicDetails" } },
                { $unwind: "$topicDetails" },
                { $project: { _id: 0, topicId: "$_id", name: "$topicDetails.topicName", count: "$count" } }
            ]),
            // Agregasi yang disempurnakan untuk 5 domisili teratas
            VisitorLog.aggregate([
                { $match: cityDateFilter },
                { $lookup: { from: "learners", localField: "learner", foreignField: "_id", as: "learnerDetails" } },
                { $unwind: "$learnerDetails" },
                { $group: { _id: { learner: "$learner", city: "$learnerDetails.learnerCity" } } },
                { $group: { _id: "$_id.city", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
                { $project: { _id: 0, label: "$_id", count: "$count" } }
            ]),
            Topic.countDocuments(),
            Admin.countDocuments()
        ]);
        
        const totalUniqueVisitors = totalUniqueVisitorsResult[0]?.count || 0;

        res.status(200).json({
            totalVisitors,
            totalUniqueVisitors,
            visitorDistribution,
            uniqueVisitorDistribution,
            favoriteTopic: topicVisitDistribution[0] || {},
            topicDistribution: topicVisitDistribution,
            cityDistribution,
            mostfrequentcity: cityDistribution[0] || {},
            totalTopics,
            totalAdmins,
        });

    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data statistik.', error: error.message });
    }
};