import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SettingSchema = new Schema({
    // Kunci unik untuk grup pengaturan, misal: 'app_settings'
    key: {
        type: String,
        required: true,
        unique: true,
        default: 'app_settings'
    },
    // Nilai pengaturan disimpan sebagai objek
    value: {
        maxAdmins: {
            type: Number,
            required: true,
            default: 5 // Batas default adalah 5 admin
        }
    }
}, { timestamps: true });

export default mongoose.model("Setting", SettingSchema);