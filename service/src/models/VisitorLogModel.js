import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';
const Schema = mongoose.Schema;

const VisitorLogSchema = new Schema({
    learner: {
        type: Schema.Types.ObjectId,
        ref: 'Learner',
        required: [true, 'Pengunjung tidak boleh kosong'],
        autopopulate: true
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic',
        required: [true, 'Topik tidak boleh kosong'],
        autopopulate: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: [true, 'Waktu kunjungan tidak boleh kosong']
    },
});

VisitorLogSchema.plugin(mongooseAutoPopulate);
module.exports = mongoose.model("VisitorLog", VisitorLogSchema);
