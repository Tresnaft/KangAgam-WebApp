import Setting from '../models/SettingModel.js';

/**
 * @desc    Mengambil pengaturan aplikasi
 * @route   GET /api/settings
 * @access  Private/Admin
 */
export const getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne({ key: 'app_settings' });
        // Jika pengaturan belum ada di database, buat satu dengan nilai default
        if (!settings) {
            settings = await Setting.create({
                key: 'app_settings',
                value: { maxAdmins: 5 }
            });
        }
        res.status(200).json(settings.value);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil pengaturan.', error: error.message });
    }
};

/**
 * @desc    Memperbarui pengaturan aplikasi
 * @route   PUT /api/settings
 * @access  Private/Superadmin
 */
export const updateSettings = async (req, res) => {
    try {
        const { maxAdmins } = req.body;
        if (typeof maxAdmins !== 'number' || maxAdmins < 1) {
            return res.status(400).json({ message: 'Jumlah maksimum admin tidak valid.' });
        }

        const updatedSettings = await Setting.findOneAndUpdate(
            { key: 'app_settings' },
            { $set: { 'value.maxAdmins': maxAdmins } },
            { new: true, upsert: true } // 'upsert: true' akan membuat dokumen jika belum ada
        );

        res.status(200).json({
            message: 'Pengaturan berhasil diperbarui.',
            data: updatedSettings.value
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui pengaturan.', error: error.message });
    }
};