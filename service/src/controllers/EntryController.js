import Entry from '../models/EntryModel.js';
import Topic from '../models/TopicModel.js';
import { createVocabulary } from './VocabularyController.js';
import { cleanupUploadedFiles } from '../utils/fileUtils.js'; // Utility untuk menghapus file yang diunggah

import mongoose from 'mongoose';
import fs from 'fs'; // Diperlukan untuk menghapus file jika terjadi error
import path from 'path'; // Diperlukan untuk mengelola path file
import Vocabulary from '../models/VocabularyModel.js';
import Language from '../models/LanguageModel.js';

/**
 * @desc    Menambahkan entri baru beserta gambar & file audionya
 * @route   POST /api/topics/:topicId/entries
 * @access  Private/Admin
 */
export const addEntry = async (req, res) => {
    // Middleware `multer` sudah berjalan, hasilnya ada di `req.files` dan `req.body`

    // 1. Ambil file dan data dari request
    // `req.files` adalah objek karena kita menggunakan `.fields()` di multer
    const entryImageFile = req.files.entryImage ? req.files.entryImage[0] : null;
    const uploadedAudioFiles = req.files.audioFiles || [];

    // Pastikan ada file yang diunggah sebelum mencoba mem-parsing body
    if (!entryImageFile || uploadedAudioFiles.length === 0) {
        return res.status(400).json({ message: 'File gambar entri dan minimal satu file audio harus diunggah.' });
    }

    // Gunakan transaksi untuk memastikan semua operasi database berhasil atau gagal bersamaan
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Parse data teks yang dikirim sebagai string JSON
        const { entryVocabularies } = JSON.parse(req.body.entryData);
        const { topicId } = req.params;

        // Validasi input
        if (!entryVocabularies || entryVocabularies.length !== uploadedAudioFiles.length) {
            throw new Error('Jumlah data kosakata tidak cocok dengan jumlah file audio.');
        }

        // Cek keberadaan Topik
        const topic = await Topic.findById(topicId).session(session);
        if (!topic) {
            throw new Error('Topik tidak ditemukan.');
        }

        // 2. Buat semua dokumen Kosakata
        const vocabCreationPromises = entryVocabularies.map(async (voc, index) => {
            const audioFile = uploadedAudioFiles[index];
            const language = await Language.findOne({ languageCode: voc.languageCode }).session(session);
            if (!language) {
                throw new Error(`Bahasa dengan kode '${voc.languageCode}' tidak ditemukan.`);
            }

            // Buat dokumen Vocabulary dengan path audio dari multer
            return Vocabulary.create([{
                vocab: voc.vocab,
                audioUrl: audioFile.path,
                language: language._id,
                translation: [] // Dibuat kosong dulu, akan diisi nanti
            }], { session });
        });

        const createdVocabResults = await Promise.all(vocabCreationPromises);
        const newVocabularies = createdVocabResults.flat();
        const newVocabularyIds = newVocabularies.map(v => v._id);

        // 3. Hubungkan terjemahan satu sama lain (jika lebih dari satu)
        if (newVocabularyIds.length > 1) {
            const linkPromises = newVocabularyIds.map(id =>
                Vocabulary.updateOne(
                    { _id: id },
                    { $addToSet: { translation: { $each: newVocabularyIds.filter(otherId => !otherId.equals(id)) } } }
                ).session(session)
            );
            await Promise.all(linkPromises);
        }

        // 4. Buat dokumen Entry utama
        const newEntry = (await Entry.create([{
            entryImagePath: entryImageFile.path, // Gunakan path gambar dari multer
            entryVocabularies: newVocabularyIds,
            topic: topicId
        }], { session }))[0];

        // 5. Tambahkan referensi entri baru ke dalam Topik
        topic.topicEntries.push(newEntry._id);
        await topic.save({ session });

        // Jika semua langkah berhasil, commit transaksi untuk menyimpan perubahan permanen
        await session.commitTransaction();
        session.endSession();

        // Ambil data yang sudah ter-populate untuk dikirim sebagai respons
        const populatedEntry = await Entry.findById(newEntry._id);
        res.status(201).json({
            message: 'Entri berhasil dibuat!',
            data: populatedEntry
        });

    } catch (error) {
        // Jika ada error di salah satu langkah, batalkan semua operasi database
        await session.abortTransaction();
        
        // ❗️ PENTING: Hapus file-file dengan aman
        const filesToDelete = [];
        if (entryImageFile) filesToDelete.push(entryImageFile);
        if (uploadedAudioFiles.length > 0) filesToDelete.push(...uploadedAudioFiles);
        
        // Await the cleanup before ending the session and sending the response
        await cleanupUploadedFiles(filesToDelete);

        session.endSession();

        console.error("Error saat membuat entri:", error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat membuat entri.',
            error: error.message
        });
    }
};
            

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
 * @desc    Mengambil semua entri dari sebuah topik
 * @route   GET /api/topics/:topicId/entries
 * @access  Public
 */
export const getEntriesByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;

        // First, check if the topic exists to provide a good error message
        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan' });
        }

        // === FIX ===
        // Directly query the Entry collection for entries matching the topicId
        // This is the correct way to get the real, current list of entries.
        const entries = await Entry.find({ topic: topicId });

        res.status(200).json({
            message: 'Berhasil mengambil entri',
            entries: entries // Send back the real entries
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil entri',
            error: error.message
        });
    }
};

/**
 * @desc    Mengambil entri berdasarkan ID
 * @route   GET /api/topics/:topicId/entries/:id
 * @access  Public
 */
export const getEntryById = async (req, res) => {
    try {
        const { topicId, id } = req.params;

        // Cek apakah topik ada
        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topik tidak ditemukan' });
        }
        // Cek apakah entri ada
        const entry = await Entry.findById(id);
        if (!entry) {
            return res.status(404).json({ message: 'Entri tidak ditemukan' });
        }
        res.status(200).json({
            message: 'Entri ditemukan',
            entry
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil entri',
            error: error.message
        });
    }
};

/**
 * @desc    Mengupdate entri dengan metode 'findByIdAndUpdate' yang lebih andal.
 * @route   PUT /api/entries/:entryId
 * @access  Private/Admin
 */
export const updateEntry = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log('Isi dari req.files:', req.files);
        const { entryId } = req.params;
        const existingEntry = await Entry.findById(entryId).session(session);
        if (!existingEntry) throw new Error('Entri tidak ditemukan.');

        const { entryVocabularies: newVocabData } = JSON.parse(req.body.entryData);
        const newImageFile = req.files?.entryImage?.[0];
        const audioFiles = req.files?.audioFiles || [];
        
        const finalVocabularyIds = [];
        const oldFilesToDelete = [];

        // --- 1. Proses Semua Kosakata ---
        for (const vocData of newVocabData) {
            if (vocData._id) {
                // Vocab sudah ada, update
                const vocabToUpdate = await Vocabulary.findById(vocData._id).session(session);
                if (!vocabToUpdate) continue;

                vocabToUpdate.vocab = vocData.vocab;

                if (vocData.newAudioIndex !== undefined) {
                    const audioFile = audioFiles[vocData.newAudioIndex];
                    if (!audioFile) throw new Error(`newAudioIndex ${vocData.newAudioIndex} tidak valid.`);
                    
                    if (vocabToUpdate.audioUrl) oldFilesToDelete.push(vocabToUpdate.audioUrl);
                    vocabToUpdate.audioUrl = audioFile.path;
                }
                
                await vocabToUpdate.save({ session });
                finalVocabularyIds.push(vocabToUpdate._id);

            } else {
                // Vocab baru, buat
                const language = await Language.findOne({ languageCode: vocData.languageCode }).session(session);
                if (!language) throw new Error(`Bahasa '${vocData.languageCode}' tidak ditemukan.`);

                const audioFile = audioFiles[vocData.newAudioIndex];
                if (!audioFile) throw new Error(`Vocab baru '${vocData.vocab}' tidak memiliki file audio.`);

                const newVocab = await Vocabulary.create([{
                    vocab: vocData.vocab, audioUrl: audioFile.path, language: language._id, translation: []
                }], { session });
                
                finalVocabularyIds.push(newVocab[0]._id);
            }
        }
        
        // --- 2. Link Terjemahan & Hapus Vocab Yatim ---
        const allVocabIds = finalVocabularyIds.map(id => new mongoose.Types.ObjectId(id));
        if (allVocabIds.length > 1) {
            await Promise.all(allVocabIds.map(id =>
                Vocabulary.updateOne({ _id: id }, { $set: { translation: allVocabIds.filter(otherId => !otherId.equals(id)) } }, { session })
            ));
        }

        const oldVocabularyIds = existingEntry.entryVocabularies.map(v => v._id.toString());
        const newVocabularyIdsStr = allVocabIds.map(id => id.toString());
        const vocabIdsToRemove = oldVocabularyIds.filter(id => !newVocabularyIdsStr.includes(id));
        
        if (vocabIdsToRemove.length > 0) {
            const vocabsToDelete = await Vocabulary.find({ _id: { $in: vocabIdsToRemove } }).session(session);
            vocabsToDelete.forEach(v => { if (v.audioUrl) oldFilesToDelete.push(v.audioUrl) });
            await Vocabulary.deleteMany({ _id: { $in: vocabIdsToRemove } }).session(session);
        }

        // ==================== PERUBAHAN UTAMA DI SINI ====================
        // --- 3. Persiapkan & Terapkan Update pada Entry menggunakan findByIdAndUpdate ---
        
        const updates = { entryVocabularies: allVocabIds };
        if (newImageFile) {
            if (existingEntry.entryImagePath) {
                oldFilesToDelete.push(existingEntry.entryImagePath);
            }
            updates.entryImagePath = newImageFile.path;
        }

        const updatedEntry = await Entry.findByIdAndUpdate(
            entryId,
            { $set: updates },
            { new: true, session }
        );
        // ===============================================================
        
        await session.commitTransaction();
        oldFilesToDelete.forEach(filePath => {
            if (fs.existsSync(filePath)) fs.unlink(filePath, (err) => { if (err) console.error(err) });
        });

        res.status(200).json({
            message: 'Entri berhasil diperbarui.',
            data: await Entry.findById(updatedEntry._id)
        });

    } catch (error) {
        await session.abortTransaction();
        if (req.files) {
            const allFiles = [...(req.files.entryImage || []), ...(req.files.audioFiles || [])];
            allFiles.forEach(file => { if (fs.existsSync(file.path)) fs.unlinkSync(file.path) });
        }
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui entri.', error: error.message });
    } finally {
        session.endSession();
    }
};

/**
 * @desc    Menghapus entri, kosakata terkait, dan file-filenya
 * @route   DELETE /api/topics/:topicId/entries/:entryId
 * @access  Private/Admin
 */
export const deleteEntry = async (req, res) => {
    const { topicId, entryId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Find the entry to be deleted
        const entry = await Entry.findById(entryId).session(session);
        if (!entry) {
            throw new Error('Entri tidak ditemukan.');
        }

        // 2. Collect all file paths to be deleted
        const filesToDelete = [];
        if (entry.entryImagePath) {
            filesToDelete.push(path.resolve(entry.entryImagePath));
        }

        // 3. Find and delete associated vocabularies and collect their audio URLs
        if (entry.entryVocabularies && entry.entryVocabularies.length > 0) {
            const vocabularies = await Vocabulary.find({ 
                _id: { $in: entry.entryVocabularies } 
            }).session(session);

            vocabularies.forEach(vocab => {
                if (vocab.audioUrl) {
                    filesToDelete.push(path.resolve(vocab.audioUrl));
                }
            });

            // Delete all associated vocabulary documents
            await Vocabulary.deleteMany({ 
                _id: { $in: entry.entryVocabularies } 
            }).session(session);
        }

        // 4. Delete the entry document itself
        await Entry.findByIdAndDelete(entryId).session(session);

        // 5. Remove the reference to the entry from the topic
        await Topic.updateOne(
            { _id: topicId },
            { $pull: { topicEntries: entryId } }
        ).session(session);
        
        // If all DB operations are successful, commit the transaction
        await session.commitTransaction();

        // 6. Delete the actual files from storage AFTER the transaction is successful
        filesToDelete.forEach(filePath => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Gagal menghapus file: ${filePath}`, err);
                } else {
                    console.log(`Berhasil menghapus file: ${filePath}`);
                }
            });
        });

        res.status(200).json({ message: 'Entri dan semua data terkait berhasil dihapus' });

    } catch (error) {
        // If any error occurs, abort the transaction
        await session.abortTransaction();
        console.error("Error saat menghapus entri:", error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menghapus entri.',
            error: error.message
        });
    } finally {
        // Always end the session
        session.endSession();
    }
};