// client/src/services/entryService.js

import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

/**
 * Mengambil semua entri (kosakata) untuk sebuah topik berdasarkan ID Topik.
 * @param {string} topicId - ID dari topik.
 * @returns {Promise<Object>} - Data entri dari API.
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