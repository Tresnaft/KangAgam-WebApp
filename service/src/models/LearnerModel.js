
import mongoose from 'mongoose';
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
    learnerCity: {
        type: String,
        required: [true, 'Asal Kabupaten/Kota tidak boleh kosong'],
        trim: true,
    },
});

export default mongoose.model("Learner", LearnerSchema);