import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Mengambil semua entri (kosakata) untuk sebuah topik berdasarkan ID Topik.
 */
export const getEntriesByTopicId = async (topicId) => {
  try {
    const response = await axios.get(`${API_URL}/topics/${topicId}/entries`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching entries for topic ${topicId}:`, error);
    throw error;
  }
};

/**
 * Menambahkan entri baru (kosakata) ke sebuah topik.
 */
export const addEntry = async (topicId, formData) => {
    try {
        const response = await axios.post(`${API_URL}/topics/${topicId}/entries`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding entry:', error);
        throw error;
    }
};

/**
 * Mengupdate entri yang sudah ada.
 * @param {string} topicId - ID dari topik induk.
 * @param {string} entryId - ID dari entri yang akan diupdate.
 * @param {FormData} formData - Data baru untuk entri.
 */
export const updateEntry = async (topicId, entryId, formData) => {
    try {
        // FIX: Menggunakan URL nested yang benar
        const response = await axios.put(`${API_URL}/topics/${topicId}/entries/${entryId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating entry ${entryId}:`, error);
        throw error;
    }
};

/**
 * Menghapus entri berdasarkan ID.
 * @param {string} topicId - ID dari topik induk.
 * @param {string} entryId - ID dari entri yang akan dihapus.
 */
export const deleteEntry = async (topicId, entryId) => {
    try {
        // FIX: Menggunakan URL nested yang benar
        const response = await axios.delete(`${API_URL}/topics/${topicId}/entries/${entryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting entry ${entryId}:`, error);
        throw error;
    }
};