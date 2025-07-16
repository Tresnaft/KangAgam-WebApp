import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getTopics = async (language = 'id') => {
  try {
    const response = await axios.get(`${API_URL}/topics`, {
      params: { language: language }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

export const addTopic = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/topics`, formData);
        return response.data;
    } catch (error) {
        console.error('Error adding topic:', error);
        throw error;
    }
};

export const getTopicById = async (topicId) => {
  try {
    const response = await axios.get(`${API_URL}/topics/${topicId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching topic with id ${topicId}:`, error);
    throw error;
  }
};

export const updateTopic = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}/topics/${id}`, formData);
        return response.data;
    } catch (error) {
        console.error(`Error updating topic ${id}:`, error);
        throw error;
    }
};

export const deleteTopic = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/topics/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting topic ${id}:`, error);
        throw error;
    }
};