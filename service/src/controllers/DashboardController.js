import VisitorLog from '../models/VisitorLogModel.js';
import Learner from '../models/LearnerModel.js';
import Topic from '../models/TopicModel.js';
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
            const dayOfWeek = today.getDay(); // 0=Minggu, 1=Senin
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
        
        // Kalkulasi semua data secara paralel untuk efisiensi
        const [
            totalVisitors,
            visitorDistribution,
            topicVisitDistribution,
            mostFrequentcity
        ] = await Promise.all([
            VisitorLog.countDocuments(visitorsDateFilter),
            VisitorLog.aggregate([
                { $match: visitorsDateFilter },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, count: { $sum: 1 } } },
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
            VisitorLog.aggregate([
                { $match: cityDateFilter },
                { $group: { _id: "$learner" } },
                { $lookup: { from: "learners", localField: "_id", foreignField: "_id", as: "learnerDetails" } },
                { $unwind: "$learnerDetails" },
                { $group: { _id: { $toLower: "$learnerDetails.learnerCity" }, uniqueVisitorCount: { $sum: 1 } } },
                { $sort: { uniqueVisitorCount: -1 } },
                { $limit: 1 },
                { $project: { _id: 0, name: "$_id", count: "$uniqueVisitorCount" } }
            ])
        ]);

        res.status(200).json({
            totalVisitors,
            visitorDistribution,
            favoriteTopic: topicVisitDistribution[0] || {},
            topicDistribution: topicVisitDistribution,
            mostfrequentcity: mostFrequentcity[0] || {},
        });

    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data statistik.', error: error.message });
    }
};