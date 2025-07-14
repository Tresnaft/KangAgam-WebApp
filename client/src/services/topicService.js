import axios from 'axios';

// URL base dari backend service Anda
const API_URL = 'http://localhost:5000/api';

/**
 * Mengambil semua topik dari backend.
 * @param {string} language - Kode bahasa (misal: 'id', 'en', 'su')
 * @returns {Promise<Object>} - Data topik dari API.
 */
export const getTopics = async (language = 'id') => {
  try {
    // Membuat request ke GET /api/topics dengan parameter bahasa
    const response = await axios.get(`${API_URL}/topics`, {
      params: { language: language }
    });
    // Mengembalikan data dari respons
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    // Lemparkan error agar bisa ditangani oleh komponen yang memanggil
    throw error;
  }
};