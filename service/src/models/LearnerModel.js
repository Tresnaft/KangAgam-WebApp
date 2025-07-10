
import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';
const Schema = mongoose.Schema;

const LearnerSchema = new Schema({
    learnerName: {
        type: String,
        required: [true, 'Nama tidak boleh kosong'],
        trim: true,
        minlength: 3,
        maxlength: 55,
    },
    learnerPhone: {
        type: String,
        required: [true, 'Nomor telepon tidak boleh kosong'],
        trim: true,
        minlength: 10,
        maxlength: 15,
    },
    learnerInstitution: {
        type: String,
        required: [true, 'Asal Lembaga tidak boleh kosong'],
        trim: true,
    },
});

Schema.plugin(mongooseAutoPopulate);

module.exports = mongoose.model("Learner", LearnerSchema);