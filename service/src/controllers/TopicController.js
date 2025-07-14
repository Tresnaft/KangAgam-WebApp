import Topic from '../models/TopicModel.js';
import Entry from '../models/EntryModel.js';
import Language from '../models/LanguageModel.js';


// @desc Membuat Topik Baru
// @route POST /api/topic
// @access Private/Admin
export const createTopic = async (req, res) => {
    try {
        const { topicName, topicImagePath } = req.body;

        if (!topicName || !topicImagePath) {
            return res.status(400).json({ message: 'Nama topik dan gambar topik harus diisi' });
        }

        const topicExists = await Topic.findOne({ topicName });
        if (topicExists) {
            return res.status(400).json({ message: 'Topik dengan nama ini sudah ada' });
        }

        const newTopic = await Topic.create({
            topicName,
            topicImagePath
        });

        res.status(201).json({
            message: 'Topik berhasil dibuat',
            topic: newTopic
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat membuat topik',
            error: error.message
        });
    }
};

// @desc Mengambil Semua Topik
// @route GET /api/topic
// @access Public
export const getAllTopics = async (req, res) => {
    try {
        const requestedLangCode = req.headers['accept-language'] || req.query.language || 'id';

        const requestedLanguage = await Language.findOne({languageCode: requestedLangCode});
        const fallbackLanguage = await Language.findOne({languageCode: 'id'});

        if (!requestedLanguage) {
            return res.status(400).json({ message: 'Bahasa yang diminta tidak ditemukan' });
        }

        const topics = await Topic.find({});

        const translatedTopics = topics.map(topic => {
            return {
                _id: topic._id,
                topicImagePath: topic.topicImagePath,
                topicName: findTranslation(topic.topicName, requestedLanguage.languageCode, fallbackLanguage?.languageCode),
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

// @desc Mengambil Topik Berdasarkan ID
// @route GET /api/topic/:id
// @access Public
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

// @desc Mengupdate Topik Berdasarkan ID
// @route PUT /api/topic/:id
// @access Private/Admin
export const updateTopic = async (req, res) => {
    try {
        const { topicName, topicImagePath } = req.body;

        if (!topicName || !topicImagePath) {
            return res.status(400).json({ message: 'Nama topik dan gambar topik harus diisi' });
        }

        const updatedTopic = await Topic.findByIdAndUpdate(
            req.params.id,
            { topicName, topicImagePath },
            { new: true }
        );

        if (!updatedTopic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan' });
        }

        res.status(200).json({
            message: 'Topik berhasil diperbarui',
            topic: updatedTopic
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat memperbarui topik',
            error: error.message
        });
    }
}

// @desc Menghapus Topik Berdasarkan ID
// @route DELETE /api/topic/:id
// @access Private/Admin
export const deleteTopic = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (!topic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan' });
        }

        if (topic.topicEntries.length > 0) {
            await Entry.deleteMany({ _id: { $in: topic.topicEntries } });
        }
        await Topic.deleteOne({ _id: req.params.id });
        res.status(200).json({
            message: 'Topik berhasil dihapus',
            topic
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat menghapus topik',
            error: error.message
        });
    }
};

/**
 * @desc Mencari terjemahan topik
 */
const findTranslation = (translations, langCode, fallbackLangCode) => {
    // If translations isn't an array, we can't search it. Return a default.
    console.log('Translations:', translations);
    console.log('Language Code:', langCode);
    if (!Array.isArray(translations)) {
        return typeof translations === 'string' ? translations : 'No translation available';
    }

    // Find the translation for the requested language.
    // Because we used .populate(), t.lang is the full language document.
    // We can now safely compare the languageCode strings.
    const found = translations.find(t => t.lang === langCode);
    if (found) {
        return found.value;
    }

    // If not found, find the fallback language.
    const fallback = translations.find(t => t.lang === fallbackLangCode);
    if (fallback) {
        return fallback.value;
    }

    // If still no translation, return the first one available or a default message.
    if (translations.length > 0 && translations[0].value) {
        return translations[0].value;
    }
    
    return 'No translation available';
};
