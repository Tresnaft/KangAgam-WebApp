import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Pisahkan penyimpanan gambar dan audio
        let uploadPath = 'public/';
        if (file.fieldname === 'entryImage') {
            uploadPath += 'images/entries';
        } else if (file.fieldname === 'audioFiles') {
            uploadPath += 'audio/entries';
        }
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Buat nama file yang unik dan aman. JANGAN akses req.body di sini.
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];

    if (file.fieldname === 'entryImage' && allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else if (file.fieldname === 'audioFiles' && allowedAudioTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipe file tidak diizinkan!'), false);
    }
};

// Gunakan .fields() untuk menerima beberapa jenis file
export default multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Batas 5MB
}).fields([
    { name: 'entryImage', maxCount: 1 },
    { name: 'audioFiles', maxCount: 10 } 
]);