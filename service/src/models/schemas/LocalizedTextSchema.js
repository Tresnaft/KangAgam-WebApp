  import mongoose from 'mongoose';
    const Schema = mongoose.Schema;

    const LocalizedTextSchema = new Schema({
        // Mereferensikan ke ID dari dokumen bahasa
        lang: {
            type: Schema.Types.ObjectId,
            ref: 'Language',
            required: true
        },
        // Nilai teks untuk bahasa tersebut
        value: {
            type: String,
            required: true,
            trim: true
        }
    }, { _id: false }); // _id: false agar tidak membuat ID untuk setiap terjemahan

    export default LocalizedTextSchema;
    