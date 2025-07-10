import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';
import LocalizedTextSchema from './schemas/LocalizedTextSchema.js';
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
    topicName: [LocalizedTextSchema],
    topicImagePath: {
        type: String,
        required: [true, 'Gambar topik tidak boleh kosong'],
        trim: true
    },
    topicEntries: [{
        type: Schema.Types.ObjectId,
        ref: 'Entry',
        autopopulate: true
    }],
});

TopicSchema.plugin(mongooseAutoPopulate);
export default mongoose.model("Topic", TopicSchema);