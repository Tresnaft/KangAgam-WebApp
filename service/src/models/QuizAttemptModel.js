import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';
const Schema = mongoose.Schema; 

const QuizAttemptSchema = new Schema({
    learner: {
        type: Schema.Types.ObjectId,
        ref: 'Learner',
        required: [true, 'Peserta tidak boleh kosong'],
        autopopulate: true
    },
    quiz: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: [true, 'Kuis tidak boleh kosong'],
        autopopulate: true
    },
    score: {
        type: Number,
        required: [true, 'Skor tidak boleh kosong'],
        min: 0
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: [true, 'Waktu kuis tidak boleh kosong']
    },
});

QuizAttemptSchema.plugin(mongooseAutoPopulate);
module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema);
