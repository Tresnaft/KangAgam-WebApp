import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';
const Schema = mongoose.Schema;

const VocabularySchema = new Schema({
    language: {
        type: Schema.Types.ObjectId,
        ref: 'Language',
        required: [true, 'Bahasa tidak boleh kosong'],
        autopopulate: true
    },
    vocab: {
        type: String,
        required: [true, 'Kosakata tidak boleh kosong'],
        trim: true,
        unique: true,
        minlength: 1,
        maxlength: 100,
    },
    audioUrl: {
        type: String,
        required: [true, 'URL audio tidak boleh kosong'],
        trim: true,
    },
    translation: [{
        type: Schema.Types.ObjectId,
        ref: 'Vocabulary',
        default: null,
    }],
});

VocabularySchema.plugin(mongooseAutoPopulate);

export default mongoose.model("Vocabulary", VocabularySchema);