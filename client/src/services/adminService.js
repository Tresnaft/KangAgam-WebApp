import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admins';

const login = async (adminData) => {
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
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const createAdmin = async (adminData, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(API_URL, adminData, config);
    return response.data;
};

const updateAdmin = async (id, adminData, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.put(`${API_URL}/${id}`, adminData, config);
    return response.data;
};

const deleteAdmin = async (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
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