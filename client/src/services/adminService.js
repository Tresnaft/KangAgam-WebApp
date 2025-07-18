import axios from 'axios';

// FIX: Arahkan API_URL langsung ke endpoint /admins
const API_URL = 'http://localhost:5000/api/admins';

const login = async (adminData) => {
    // URL yang dipanggil sekarang akan benar: http://localhost:5000/api/admins/login
    const response = await axios.post(API_URL + '/login', adminData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getAllAdmins = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const createAdmin = async (adminData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, adminData, config);
    return response.data;
};

const updateAdmin = async (id, adminData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/${id}`, adminData, config);
    return response.data;
};

const deleteAdmin = async (id, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};

const createLearner = async (learnerData) => {
    const response = await axios.post('http://localhost:5000/api/learners', learnerData);
    return response.data;
};

const adminService = {
    login,
    logout,
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    createLearner,
};

export default adminService;
