import Vocabulary from '../models/VocabularyModel.js';
import Language from '../models/LanguageModel.js';

/**
 * @desc Menambahkan kosakata baru 
 * @route POST /api/topics/:topicId/entries/:entryId/vocabulary
 */
export const addVocabulary = async (req, res) => {
    try {
        const { topicId, entryId } = req.params;
        const { vocab, audioPath, languageCode, translation} = req.body;

        if (!vocab || !audioPath || !languageCode) {
            return res.status(400).json({ message: 'Kosakata, audio, dan kode bahasa harus diisi' });
        }
        const language = await Language.findOne({ languageCode });
        if (!language) {
            return res.status(404).json({ message: 'Bahasa tidak ditemukan' });
        }
        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan' });
        }
        const entry = await Entry.findById(entryId);
        if (!entry) {
            return res.status(404).json({ message: 'Entri tidak ditemukan' });
        }
        // Check if vocabulary already exists
        const existingVocabulary = await Vocabulary.findOne({ vocab, language: language._id });
        if (existingVocabulary) {
            return res.status(400).json({ message: 'Kosakata ini sudah ada untuk bahasa ini' });
        }

        const newVocabulary = await Vocabulary.create({
            vocab,
            audioUrl: audioPath,
            language: language._id,
            translation: translation || []
        });

        // Add vocabulary to entry
        entry.vocabulary.push(newVocabulary._id);
        await entry.save();
        // Add vocabulary to topic
        topic.topicEntries.push(entry._id);
        await topic.save();
        
        res.status(201).json({
            message: 'Kosakata berhasil ditambahkan',
            vocabulary: newVocabulary,
            entry: entry,
            topic: topic
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan kosakata',
            error: error.message
        });
    }
};

/**
 * @desc Mengambil semua kosakata berdasarkan entri
 * @route GET /api/topics/:topicId/entries/:entryId/vocabulary-all
 * @access Public
 */
export const getVocabulariesByEntry = async (req, res) => {
    try {
        const { topicId, entryId } = req.params;
        const entry = await Entry.findById(entryId).populate('vocabulary');
        if (!entry) {
            return res.status(404).json({ message: 'Entri tidak ditemukan' });
        }

        const vocabularies = entry.vocabulary;
        res.status(200).json({
            message: 'Berhasil mengambil kosakata',
            vocabularies
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil kosakata',
            error: error.message
        });
    }
};
            
/**
 * @desc Mengambil kosakata entri berdasarkan bahasa
 * @route GET /api/topics/:topicId/entries/:entryId/vocabulary?lang=id
 * @access Public
 */
export const getVocabularies = async (req, res) => {
    try {
        const { topicId, entryId } = req.params;
        const { lang } = req.query.lang || 'id';

        if (!lang) {
            return res.status(400).json({ message: 'Kode bahasa tidak boleh kosong' });
        }

        const language = await Language.findOne({ languageCode: lang });
        if (!language) {
            return res.status(404).json({ message: 'Bahasa tidak ditemukan' });
        }

        const entry = await Entry.findById(entryId);
        if (!entry) {
            return res.status(404).json({ message: 'Entri tidak ditemukan' });
        }
        const vocabularies = await Vocabulary.find({ language: language._id, _id: { $in: entry.vocabulary } });
        if (!vocabularies.length) {
            return res.status(404).json({ message: 'Kosakata tidak ditemukan untuk bahasa ini' });
        }
        res.status(200).json({
            message: 'Berhasil mengambil kosakata',
            vocabularies
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil kosakata',
            error: error.message
        });
    }
}

/**
 * @desc Mengambil semua kosakata untuk bahasa tertentu
 * @route GET /api/vocabulary?lang=id
 */
export const getVocabulariesByLanguage = async (req, res) => {
    try {
        const langCode = req.query.lang || 'id';
        if(!langCode) {
            return res.status(400).json({ message: 'Kode bahasa tidak boleh kosong' });
        }

        const language = await Language.findOne({ languageCode: langCode });
        if (!language) {
            return res.status(404).json({ message: 'Bahasa tidak ditemukan' });
        }

        const vocabularies = await Vocabulary.find({ language: language._id });
        res.status(200).json({
            message: 'Berhasil mengambil kosakata',
            vocabularies
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil kosakata',
            error: error.message
        });
    }
};

/**
 * @desc Membuat kosakata baru
 */

export async function createVocabulary(vocab, audioPath, languageCode, translation) {
    try {
        if (!vocab || !audioPath || !languageCode) {
            throw new Error('Kosakata, audio, dan kode bahasa harus diisi');
        }

        const language = await Language.findOne({ languageCode });
        if (!language) {
            throw new Error('Bahasa tidak ditemukan');
        }
        const existingVocabulary = await Vocabulary.findOne({ vocab, language: language._id });
        if (existingVocabulary) {
            throw new Error('Kosakata ini sudah ada untuk bahasa ini');
        }
        const newVocabulary = await Vocabulary.create({
            vocab,
            audioUrl: audioPath,
            language: language._id,
            translation: translation || []
        });
        return newVocabulary._id;
    } catch (error) {
        throw new Error(`Terjadi kesalahan saat membuat kosakata: ${
            error.message
        }`);
    }
}

/**
 * @desc Menghubungkan kosakata dengan translasinya
 */
export function linkVocabularyTranslations(vocabularyId, translationIds) {
    return Vocabulary.findByIdAndUpdate(
        vocabularyId,
        { $set: { translation: translationIds } },
        { new: true }
    );
}
