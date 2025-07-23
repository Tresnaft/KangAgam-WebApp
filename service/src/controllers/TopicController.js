import Topic from '../models/TopicModel.js';
import Entry from '../models/EntryModel.js';
import Vocabulary from '../models/VocabularyModel.js';
import VisitorLog from '../models/VisitorLogModel.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

export const createTopic = async (req, res) => {
    try {
        const { topicNames, status } = req.body;
        const topicImagePath = req.file ? req.file.path : null;

        if (!topicNames || !topicImagePath) {
            return res.status(400).json({ message: 'Nama topik dan file gambar harus diisi' });
        }

        const parsedTopicNames = JSON.parse(topicNames);

        if (!Array.isArray(parsedTopicNames) || parsedTopicNames.length === 0 || !parsedTopicNames.find(n => n.lang === 'id')?.value) {
            return res.status(400).json({ message: 'Nama topik dalam Bahasa Indonesia tidak boleh kosong.' });
        }

        const finalImagePath = topicImagePath.replace(/\\/g, '/').replace('public', '');
        
        const indonesianName = parsedTopicNames.find(n => n.lang === 'id').value;
        const topicExists = await Topic.findOne({ "topicName.value": indonesianName, "topicName.lang": "id" });
        if (topicExists) {
            return res.status(400).json({ message: 'Topik dengan nama ini sudah ada' });
        }

        const newTopic = await Topic.create({
            topicName: parsedTopicNames,
            topicImagePath: finalImagePath,
            status: status || 'Published'
        });

        res.status(201).json({
            message: 'Topik berhasil dibuat',
            topic: newTopic
        });
    } catch (error) {
        console.error("Error di createTopic:", error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat membuat topik',
            error: error.message
        });
    }
};

export const updateTopic = async (req, res) => {
    const { id } = req.params;
    const { topicNames, status } = req.body;
    const newImageFile = req.file;

    try {
        const topic = await Topic.findById(id);
        if (!topic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan' });
        }

        const oldImagePath = topic.topicImagePath;

        const parsedTopicNames = JSON.parse(topicNames);
        if (!Array.isArray(parsedTopicNames) || parsedTopicNames.length === 0 || !parsedTopicNames.find(n => n.lang === 'id')?.value) {
            return res.status(400).json({ message: 'Nama topik dalam Bahasa Indonesia tidak boleh kosong.' });
        }
        
        topic.topicName = parsedTopicNames;
        topic.status = status || topic.status;

        if (newImageFile) {
            topic.topicImagePath = newImageFile.path.replace(/\\/g, '/').replace('public', '');
        }

        const updatedTopic = await topic.save();

        if (newImageFile && oldImagePath) {
            const fullOldPath = path.resolve(`public${oldImagePath}`);
            if (fs.existsSync(fullOldPath)) {
                fs.unlink(fullOldPath, (err) => {
                    if (err) console.error(`Gagal menghapus file lama: ${fullOldPath}`, err);
                });
            }
        }

        res.status(200).json({ message: 'Topik berhasil diperbarui', topic: updatedTopic });

    } catch (error) {
        if (newImageFile) {
            fs.unlink(newImageFile.path, (err) => {
                if(err) console.error("Gagal hapus file baru saat update gagal", err)
            });
        }
        console.error("Error di updateTopic:", error);
        res.status(500).json({ message: 'Gagal memperbarui topik', error: error.message });
    }
};

export const deleteTopic = async (req, res) => {
    const { id } = req.params;
    try {
        const topic = await Topic.findById(id);
        if (!topic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan.' });
        }

        const filesToDelete = [];
        if (topic.topicImagePath) {
            filesToDelete.push(path.resolve(`public${topic.topicImagePath}`));
        }

        const entries = await Entry.find({ topic: topic._id });

        for (const entry of entries) {
            if (entry.entryImagePath) {
                filesToDelete.push(path.resolve(`public${entry.entryImagePath}`));
            }
            if (entry.entryVocabularies && entry.entryVocabularies.length > 0) {
                const vocabs = await Vocabulary.find({ _id: { $in: entry.entryVocabularies } });
                vocabs.forEach(v => {
                    if (v.audioUrl) {
                        filesToDelete.push(path.resolve(`public${v.audioUrl}`));
                    }
                });
                await Vocabulary.deleteMany({ _id: { $in: entry.entryVocabularies } });
            }
        }
        
        if (entries.length > 0) {
            await Entry.deleteMany({ topic: topic._id });
        }

        await Topic.findByIdAndDelete(id);

        filesToDelete.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, err => {
                    if (err) console.error(`Gagal menghapus file: ${filePath}`, err);
                });
            }
        });

        res.status(200).json({ message: 'Topik dan semua data terkait berhasil dihapus.' });

    } catch (error) {
        console.error("Error saat menghapus topik:", error);
        res.status(500).json({ message: 'Gagal menghapus topik.', error: error.message });
    }
};

export const getAllTopics = async (req, res) => {
    try {
        const requestedLangCode = req.query.language || 'id';

        const visitCounts = await VisitorLog.aggregate([
            { $group: { _id: "$topic", count: { $sum: 1 } } }
        ]);

        const visitCountMap = new Map(visitCounts.map(item => [item._id.toString(), item.count]));

        const topics = await Topic.find({});

        const translatedTopics = topics.map(topic => {
            const nameObj = topic.topicName.find(t => t.lang === requestedLangCode) || topic.topicName.find(t => t.lang === 'id') || topic.topicName[0];
            return {
                _id: topic._id,
                topicImagePath: topic.topicImagePath,
                topicName: nameObj ? nameObj.value : "Tanpa Nama",
                topicEntries: topic.topicEntries,
                status: topic.status,
                allTopicNames: topic.topicName,
                visitCount: visitCountMap.get(topic._id.toString()) || 0
            };
        });

        res.status(200).json({
            message: 'Berhasil mengambil semua topik',
            topics: translatedTopics
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil topik',
            error: error.message
        });
    }
};

export const getTopicById = async (req, res) => {
    try {
        const topicId = req.params.id;
        const topic = await Topic.findById(topicId);

        if (!topic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan' });
        }

        // Hitung jumlah kunjungan untuk topik ini
        const visitCount = await VisitorLog.countDocuments({ topic: topicId });

        // Gabungkan data topik dengan jumlah kunjungan
        const topicWithVisits = {
            ...topic.toObject(), // Konversi dokumen Mongoose ke objek biasa
            visitCount: visitCount
        };

        res.status(200).json({
            message: 'Berhasil mengambil topik',
            topic: topicWithVisits
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil topik',
            error: error.message
        });
    }
};