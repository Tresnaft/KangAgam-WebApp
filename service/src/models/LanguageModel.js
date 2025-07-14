import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const LanguageSchema = new Schema({
    languageName: {
        type: String,
        required: [true, 'Nama bahasa tidak boleh kosong'],
        trim: true,
        minlength: 3,
        maxlength: 55,
    },
    languageCode: {
        type: String,
        required: [true, 'Kode bahasa tidak boleh kosong'],
        trim: true,
        unique: true,
        match: [/^[a-z]{2,3}(-[A-Z]{2})?$/, 'Masukkan kode bahasa yang valid'],
    },
});

export default mongoose.model("Language", LanguageSchema);