import Vocabulary from '../models/VocabularyModel.js';
import Language from '../models/LanguageModel.js';

/**
 * @desc Menambahkan kosakata baru 
 * @route POST /api/topics/:topicId/entries/:entryId/vocabulary
 */
// export const addVocabulary = async (req, res) => {
//     try {
//         const { topicId, entryId } = req.params;
//         const { languageCode, vocab, audioUrl, translation } = req.body;

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
