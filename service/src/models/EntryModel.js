import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
const Schema = mongoose.Schema;

const EntrySchema = new Schema({
    entryImagePath: {
        type: String,
        required: true,
        trim: true
    },
    entryVocabularies: [{
        type: Schema.Types.ObjectId,
        ref: 'Vocabulary',
        required: [true, 'Kosakata tidak boleh kosong'],
        autopopulate: true
    }],
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic',
        required: [true, 'Topik tidak boleh kosong'],
    },
});

EntrySchema.plugin(autopopulate);

export default mongoose.model("Entry", EntrySchema);