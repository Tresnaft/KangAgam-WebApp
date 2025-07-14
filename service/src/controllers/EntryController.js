import Entry from '../models/EntryModel.js';
import Topic from '../models/TopicModel.js';

/**
 * @desc Membuat entri baru untuk sebuah topik
 * @route POST /api/topics/:topicId/entries
 * @access Private/Admin
 */
export const createEntry = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { entryName, entryImagePath } = req.body;

        if (!entryName || !entryImagePath) {
            return res.status(400).json({ message: 'Nama entri dan gambar entri harus diisi' });
        }

        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan' });
        }

        const newEntry = await Entry.create({
            entryName,
            entryImagePath,
            topic: topicId
        });

        topic.topicEntries.push(newEntry._id);
        await topic.save();

        res.status(201).json({
            message: 'Entri berhasil dibuat',
            entry: newEntry
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat membuat entri',
            error: error.message
        });
    }
}

/**
 * @desc Mengambil semua entri dari sebuah topik
 * @route GET /api/topics/:topicId/entries
 * @access Public
 */
export const getEntriesByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan' });
        }

        res.status(200).json({
            message: 'Berhasil mengambil entri',
            entries: topic.topicEntries
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil entri',
            error: error.message
        });
    }
};

/** 
 * @desc Mengupdate entri berdasarkan ID
 * @route PUT /api/topics/:topicId/entries/:id
 * @access Private/Admin
 */
export const updateEntry = async (req, res) => {
    try {
        const { topicId, id } = req.params;
        const { entryName, entryImagePath } = req.body;

        if (!entryName || !entryImagePath) {
            return res.status(400).json({ message: 'Nama entri dan gambar entri harus diisi' });
        }

        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan' });
        }

        const entry = await Entry.findByIdAndUpdate(id, {
            entryName,
            entryImagePath
        }, { new: true });

        if (!entry) {
            return res.status(404).json({ message: 'Entri tidak ditemukan' });
        }

        res.status(200).json({
            message: 'Entri berhasil diperbarui',
            entry
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat memperbarui entri',
            error: error.message
        });
    }
}

/**
 * @desc Menghapus entri berdasarkan ID
 * @route DELETE /api/topics/:topicId/entries/:id
 * @access Private/Admin
 */
export const deleteEntry = async (req, res) => {
    try {
        const { topicId, id } = req.params;

        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan' });
        }
        const entry = await Entry.findByIdAndDelete(id);
        if (!entry) {
            return res.status(404).json({ message: 'Entri tidak ditemukan' });
        }
        
        await Topic.findByIdAndUpdate(topicId, {
            $pull: { topicEntries: id }
        });

        await Entry.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Entri berhasil dihapus',
            entry
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat menghapus entri',
            error: error.message
        });
    }
};


