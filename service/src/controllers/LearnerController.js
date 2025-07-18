import Learner from '../models/LearnerModel.js'; // Pastikan path dan nama file model sudah benar
import mongoose from 'mongoose';

/**
 * @desc    Membuat (Create) learner baru
 * @route   POST /api/learners
 * @access  Public
 */
export const createLearner = async (req, res) => {
    try {
        const { learnerName, learnerPhone, learnerInstitution } = req.body;

        // Validasi input dasar
        if (!learnerName || !learnerPhone || !learnerInstitution) {
            return res.status(400).json({ message: 'Semua field (nama, telepon, lembaga) harus diisi.' });
        }

        // --- Langkah 1: Cari learner dengan nama DAN nomor telepon yang sama ---
        const existingLearner = await Learner.findOne({ learnerName, learnerPhone });

        // --- Langkah 2: Jika sudah ada, kembalikan data yang ada ---
        if (existingLearner) {
            return res.status(200).json({ // Gunakan status 200 OK karena kita tidak membuat data baru
                message: 'Learner dengan data ini sudah terdaftar. Menggunakan data yang ada.',
                data: existingLearner
            });
        }

        // --- Langkah 3: Jika tidak ada, buat learner baru ---
        const newLearner = await Learner.create({
            learnerName,
            learnerPhone,
            learnerInstitution
        });

        res.status(201).json({ // Gunakan status 201 Created karena ini data baru
            message: 'Learner berhasil dibuat.',
            data: newLearner
        });

    } catch (error) {
        res.status(500).json({ message: 'Gagal memproses data learner.', error: error.message });
    }
};

/**
 * @desc    Mendapatkan (Read) semua data learner
 * @route   GET /api/learners
 * @access  Private/Admin
 */
export const getAllLearners = async (req, res) => {
    try {
        const learners = await Learner.find({});
        res.status(200).json({
            count: learners.length,
            data: learners
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data learners.', error: error.message });
    }
};

/**
 * @desc    Mendapatkan (Read) satu learner berdasarkan ID
 * @route   GET /api/learners/:id
 * @access  Public
 */
export const getLearnerById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID tidak valid.' });
        }

        const learner = await Learner.findById(id);

        if (!learner) {
            return res.status(404).json({ message: 'Learner tidak ditemukan.' });
        }

        res.status(200).json({ data: learner });

    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data learner.', error: error.message });
    }
};

/**
 * @desc    Memperbarui (Update) data learner
 * @route   PUT /api/learners/:id
 * @access  Private/Admin
 */
export const updateLearner = async (req, res) => {
    try {
        const { id } = req.params;
        const { learnerName, learnerPhone, learnerInstitution } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID tidak valid.' });
        }

        const updatedLearner = await Learner.findByIdAndUpdate(
            id,
            { learnerName, learnerPhone, learnerInstitution },
            { new: true, runValidators: true } // 'new: true' untuk mengembalikan dokumen yang sudah diupdate
        );

        if (!updatedLearner) {
            return res.status(404).json({ message: 'Learner tidak ditemukan.' });
        }

        res.status(200).json({
            message: 'Data learner berhasil diperbarui.',
            data: updatedLearner
        });

    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui data learner.', error: error.message });
    }
};

/**
 * @desc    Menghapus (Delete) data learner
 * @route   DELETE /api/learners/:id
 * @access  Private/Admin
 */
export const deleteLearner = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID tidak valid.' });
        }

        const learner = await Learner.findByIdAndDelete(id);

        if (!learner) {
            return res.status(404).json({ message: 'Learner tidak ditemukan.' });
        }
        
        // Catatan: Jika learner terhubung dengan data lain (misal: QuizAttempt), 
        // Anda mungkin perlu menghapus data terkait tersebut di sini juga.

        res.status(200).json({ message: 'Learner berhasil dihapus.' });

    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus learner.', error: error.message });
    }
};