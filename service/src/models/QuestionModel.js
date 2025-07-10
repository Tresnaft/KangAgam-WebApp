import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    questionAudioPath: {
        type: String,
        required: [true, 'Path audio pertanyaan tidak boleh kosong'],
        trim: true
    },
    answerOptions: [{
        type: Schema.Types.ObjectId,
        ref: 'Entry',
        required: [true, 'Pilihan jawaban tidak boleh kosong'],
        autopopulate: true
    }],
    correctAnswer: {
        type: Schema.Types.ObjectId,
        ref: 'Entry',
        required: [true, 'Jawaban benar tidak boleh kosong'],
        autopopulate: true
    },
});

QuestionSchema.plugin(autopopulate);
module.exports = mongoose.model("Question", QuestionSchema);
