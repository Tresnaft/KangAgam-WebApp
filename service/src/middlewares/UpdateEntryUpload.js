import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Helper function to create a URL-friendly "slug"
const slugify = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = file.fieldname === 'entryImage' ? 'public/images' : 'public/audio';
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: async (req, file, cb) => {
        try {
            // Pre-computation: Parse entryData only once per request
            if (!req.parsedData) {
                try {
                    req.parsedData = JSON.parse(req.body.entryData);
                } catch (jsonError) {
                    return cb(new Error('Format entryData tidak valid atau bukan JSON.'));
                }
                // Initialize an index to track audio files
                req.audioFileIndex = 0; 
            }

            const { entryVocabularies } = req.parsedData;
            let finalName;

            if (file.fieldname === 'entryImage') {
                // For the image, use the primary (Indonesian) vocab as the base name
                const primaryVocab = entryVocabularies.find(v => v.languageCode === 'id') || entryVocabularies[0];
                finalName = `${slugify(primaryVocab.vocab)}${path.extname(file.originalname)}`;
            } else if (file.fieldname === 'audioFiles') {
                // Find the vocab data that corresponds to this audio file
                const vocabData = entryVocabularies.find(v => v.newAudioIndex === req.audioFileIndex);
                if (!vocabData) {
                    // This is a fallback for new vocabs that might not have a specific index
                    // This part is less reliable, which is why controller-based renaming is safer
                    const unindexedVocabs = entryVocabularies.filter(v => v.newAudioIndex === undefined && v._id === undefined);
                    const currentNewVocab = unindexedVocabs[req.audioFileIndex - entryVocabularies.filter(v=>v.newAudioIndex !==undefined).length] || {};
                    finalName = `${slugify(currentNewVocab.vocab || 'unknown')}_${currentNewVocab.languageCode || 'xx'}${path.extname(file.originalname)}`;
                } else {
                     finalName = `${slugify(vocabData.vocab)}_${vocabData.languageCode}${path.extname(file.originalname)}`;
                }
                req.audioFileIndex++;
            }

            cb(null, finalName);
        } catch (error) {
            cb(error);
        }
    }
});

const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp|svg/;
    const allowedAudioTypes = /mpeg|mp3|wav|ogg/;

    const isImage = file.fieldname === 'entryImage' && allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const isAudio = file.fieldname === 'audioFiles' && allowedAudioTypes.test(path.extname(file.originalname).toLowerCase());

    if (isImage || isAudio) {
        cb(null, true);
    } else {
        cb(new Error('Tipe file tidak diizinkan!'), false);
    }
};

export default multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
}).fields([
    { name: 'entryImage', maxCount: 1 },
    { name: 'audioFiles', maxCount: 10 }
]);