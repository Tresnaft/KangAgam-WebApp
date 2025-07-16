// middleware/entryUpload.js

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Topic from '../models/TopicModel.js';

// Fungsi helper untuk membuat "slug" yang aman untuk nama file
const slugify = (text) => text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

const storage = multer.diskStorage({
    // Destination tetap sederhana, tidak ada perubahan di sini
    destination: (req, file, cb) => {
        let uploadPath = 'public/';
        if (file.fieldname === 'entryImage') {
            uploadPath += 'images';
        } else if (file.fieldname === 'audioFiles') {
            uploadPath += 'audio';
        }
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },

    // Logika utama ada di sini
    filename: async (req, file, cb) => {
        try {
            // --- Caching & Pre-computation (Hanya berjalan sekali per request) ---
            if (!req.entrySlug) {
                // 1. Parse data dari body
                try {
                    req.parsedData = JSON.parse(req.body.entryData);
                } catch (jsonError) {
                    return cb(new Error('Format entryData tidak valid atau bukan JSON.'));
                }
                const { entryVocabularies } = req.parsedData;

                // 2. Tentukan nama entri utama
                // Kita akan gunakan kosakata Bahasa Indonesia sebagai nama entri
                let primaryVocab = entryVocabularies.find(v => v.languageCode === 'id') || entryVocabularies[0];
                if (!primaryVocab) {
                    // Fallback jika tidak ada vocab sama sekali
                    primaryVocab = { vocab: 'untitled' };
                }
                req.entrySlug = slugify(primaryVocab.vocab);

                // 3. Inisialisasi index audio
                req.audioFileIndex = 0;
            }

            let finalName;
            
            // --- Logika Penamaan File BARU ---
            if (file.fieldname === 'entryImage') {
                // Format untuk gambar: namaentri.ext
                finalName = `${req.entrySlug}${path.extname(file.originalname)}`;
            } else if (file.fieldname === 'audioFiles') {
                // Ambil kode bahasa dari data vocab yang sesuai
                const vocabData = req.parsedData.entryVocabularies[req.audioFileIndex];
                const langCode = vocabData.languageCode;
                
                // Format untuk audio: namaentri_bahasa.ext
                finalName = `${req.entrySlug}_${langCode}${path.extname(file.originalname)}`;
                req.audioFileIndex++;
            }

            cb(null, finalName);
        } catch (error) {
            cb(error);
        }
    }
});

// ❗️ FIX: Definisikan tipe file yang diizinkan di sini
const allowedMimeTypes = {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    audio: ['audio/mpeg', 'audio/wave', 'audio/ogg', 'audio/mp3']
};

const fileFilter = (req, file, cb) => {
    // Validasi tipe file secara dinamis
    if (file.fieldname === 'entryImage' && allowedMimeTypes.images.includes(file.mimetype)) {
        cb(null, true);
    } else if (file.fieldname === 'audioFiles' && allowedMimeTypes.audio.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // Memberikan pesan error yang lebih spesifik
        const error = new Error(`Tipe file tidak diizinkan: ${file.mimetype}`);
        error.code = 'LIMIT_FILE_TYPE';
        cb(error, false);
    }
};

// Ekspor middleware multer dengan konfigurasi .fields()
export default multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Batas ukuran file 5MB (opsional, tapi direkomendasikan)
    }
}).fields([
    { name: 'entryImage', maxCount: 1 }, // Menerima 1 file dari field 'entryImage'
    { name: 'audioFiles', maxCount: 10 } // Menerima hingga 10 file dari field 'audioFiles'
]);