import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';
const Schema = mongoose.Schema; 

const QuizSchema = new Schema({
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic',
        required: [true, 'Topik tidak boleh kosong'],
        autopopulate: true
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: [true, 'Pertanyaan tidak boleh kosong'],
        autopopulate: true
    }],
});

QuizSchema.plugin(mongooseAutoPopulate);
module.exports = mongoose.model("Quiz", QuizSchema);
