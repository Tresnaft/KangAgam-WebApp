import Language from '../models/LanguageModel.js';

/**
 * @desc Membuat Bahasa Baru
 * @route POST /api/languages
 */
export const createLanguage = async (req, res) => {
    try {
        const { languageName, languageCode } = req.body;

        if (!languageName || !languageCode) {
            return res.status(400).json({ message: 'Nama bahasa dan kode bahasa harus diisi' });
        }

        const languageExists = await Language.findOne({ languageCode });
        if (languageExists) {
            return res.status(400).json({ message: 'Bahasa dengan kode ini sudah ada' });
        }

        const newLanguage = await Language.create({
            languageName,
            languageCode
        });

        res.status(201).json({
            message: 'Bahasa berhasil dibuat',
            language: newLanguage
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat membuat bahasa',
            error: error.message
        });
    }
};

/**
 * @desc Mengambil Semua Bahasa
 * @route GET /api/languages
 */
export const getAllLanguages = async (req, res) => {
    try {
        const languages = await Language.find({});
        res.status(200).json({
            message: 'Berhasil mengambil semua bahasa',
            languages
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil bahasa',
            error: error.message
        });
    }
};

/**
 * @desc Menghapus Bahasa Berdasarkan ID
 * @route DELETE /api/languages/:id
 */
export const deleteLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const language = await Language.findById(id);
        if (!language) {
            return res.status(404).json({ message: 'Bahasa tidak ditemukan' });
        }

        await Language.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Bahasa berhasil dihapus',
            language
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat menghapus bahasa',
            error: error.message
        });
    }
};
