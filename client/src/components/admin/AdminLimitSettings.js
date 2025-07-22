import React, { useState } from 'react';
import settingService from '../../services/settingService';
import { useAuth } from '../../context/AuthContext';

const AdminLimitSettings = ({ currentLimit, onSettingsUpdate }) => {
    const { user } = useAuth();
    const [limit, setLimit] = useState(currentLimit);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!user?.token) {
            alert("Otentikasi gagal.");
            return;
        }
        setIsSaving(true);
        try {
            const newSettings = { maxAdmins: parseInt(limit, 10) };
            await settingService.updateSettings(newSettings, user.token);
            alert('Batas admin berhasil diperbarui!');
            onSettingsUpdate(newSettings.maxAdmins); // Beri tahu komponen induk tentang perubahan
        } catch (error) {
            alert(error.message || 'Gagal menyimpan pengaturan.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-background-secondary p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold text-text mb-2">Pengaturan Superadmin</h4>
            <div className="flex items-center gap-4">
                <label htmlFor="maxAdmins" className="text-sm text-text-secondary">Maksimum Admin:</label>
                <input
                    type="number"
                    id="maxAdmins"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-background text-text"
                    min="1"
                />
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary text-white font-bold px-4 py-1.5 rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
                >
                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </div>
    );
};

export default AdminLimitSettings;