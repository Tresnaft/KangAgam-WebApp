import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admins';

/**
 * Mengirimkan permintaan login ke API.
 * @param {object} adminData - Data email dan password admin.
 * @returns {Promise<object>} Data pengguna dari server jika berhasil.
 */
const login = async (adminData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, adminData);
        
        // PERBAIKAN: Baris di bawah ini dihapus.
        // Tugas menyimpan data ke localStorage sekarang sepenuhnya ditangani
        // oleh AuthContext setelah fungsi ini mengembalikan data.
        // 
        // if (response.data) {
        //     localStorage.setItem('user', JSON.stringify(response.data));
        // }
        
        return response.data;
    } catch (error) {
        console.error('Error login:', error);
        throw error.response?.data || { message: 'Gagal login.' };
    }
};

/**
 * Menghapus data pengguna dari localStorage.
 * Catatan: Fungsi ini bisa dihapus jika logout juga sepenuhnya ditangani oleh AuthContext.
 */
const logout = () => {
    localStorage.removeItem('user');
};

/**
 * Mengambil semua data admin dari server.
 * @param {string} token - Token JWT untuk otorisasi.
 * @returns {Promise<object>} Daftar semua admin.
 */
const getAllAdmins = async (token) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        console.error('Error getAllAdmins:', error);
        throw error.response?.data || { message: 'Gagal mengambil data admin.' };
    }
};

/**
 * Membuat admin baru.
 * @param {object} adminData - Data admin baru.
 * @param {string} token - Token JWT untuk otorisasi.
 * @returns {Promise<object>} Data admin yang baru dibuat.
 */
const createAdmin = async (adminData, token) => {
    try {
        console.log('Creating admin with data:', adminData);
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.post(API_URL, adminData, config);
        return response.data;
    } catch (error) {
        console.error('Error createAdmin:', error);
        throw error.response?.data || { message: 'Gagal membuat admin.' };
    }
};

/**
 * Memperbarui data admin.
 * @param {string} id - ID admin yang akan diupdate.
 * @param {object} adminData - Data baru untuk admin.
 * @param {string} token - Token JWT untuk otorisasi.
 * @returns {Promise<object>} Data admin yang sudah diperbarui.
 */
const updateAdmin = async (id, adminData, token) => {
    try {
        console.log('Updating admin ID:', id, 'with data:', adminData);
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.put(`${API_URL}/${id}`, adminData, config);
        return response.data;
    } catch (error) {
        console.error('Error updateAdmin:', error);
        throw error.response?.data || { message: 'Gagal memperbarui admin.' };
    }
};

/**
 * Menghapus admin.
 * @param {string} id - ID admin yang akan dihapus.
 * @param {string} token - Token JWT untuk otorisasi.
 * @returns {Promise<object>} Pesan konfirmasi.
 */
const deleteAdmin = async (id, token) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.delete(`${API_URL}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error('Error deleteAdmin:', error);
        throw error.response?.data || { message: 'Gagal menghapus admin.' };
    }
};

const adminService = {
    login,
    logout,
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
};

export default adminService;