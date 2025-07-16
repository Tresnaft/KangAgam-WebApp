import Topic from '../models/TopicModel.js';
import Entry from '../models/EntryModel.js';
import Vocabulary from '../models/VocabularyModel.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

export const createTopic = async (req, res) => {
    try {
        const { topicName } = req.body;
        const topicImagePath = req.file ? req.file.path : null;
        if (!topicName || !topicImagePath) {
            return res.status(400).json({ message: 'Nama topik dan file gambar harus diisi' });
        }
        const finalImagePath = topicImagePath.replace(/\\/g, '/').replace('public', '');
        const topicExists = await Topic.findOne({ "topicName.value": topicName });
        if (topicExists) {
            return res.status(400).json({ message: 'Topik dengan nama ini sudah ada' });
        }
        const newTopic = await Topic.create({
            topicName: [{ lang: 'id', value: topicName }],
            topicImagePath: finalImagePath
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
    const { topicName } = req.body;
    const newImageFile = req.file;

    try {
        const topic = await Topic.findById(id);
        if (!topic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan' });
        }

        const oldImagePath = topic.topicImagePath;

        const nameIndex = topic.topicName.findIndex(t => t.lang === 'id');
        if (nameIndex > -1) {
            topic.topicName[nameIndex].value = topicName;
        } else {
            topic.topicName.push({ lang: 'id', value: topicName });
        }

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

// FIX: Logika hapus tanpa menggunakan transaksi database
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
                        // Pastikan path audio juga di-resolve dengan benar
                        filesToDelete.push(path.resolve(v.audioUrl));
                    }
                });
                await Vocabulary.deleteMany({ _id: { $in: entry.entryVocabularies } });
            }
        }
        
        if (entries.length > 0) {
            await Entry.deleteMany({ topic: topic._id });
        }

        await Topic.findByIdAndDelete(id);

        // Hapus semua file yang terkumpul
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
        const topics = await Topic.find({});

        const translatedTopics = topics.map(topic => {
            const nameObj = topic.topicName.find(t => t.lang === requestedLangCode) || topic.topicName.find(t => t.lang === 'id') || topic.topicName[0];
            return {
                _id: topic._id,
                topicImagePath: topic.topicImagePath,
                topicName: nameObj ? nameObj.value : "Tanpa Nama",
                topicEntries: topic.topicEntries
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
        const topic = await Topic.findById(req.params.id);
        if (!topic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan' });
        }
        res.status(200).json({
            message: 'Berhasil mengambil topik',
            topic
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil topik',
            error: error.message
        });
    }
};