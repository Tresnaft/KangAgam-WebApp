import React from 'react';
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout()
        navigate('/admin/login')
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2">Selamat datang, {user?.email || 'Admin'}!</p>

            <button
                onClick={handleLogout}
                className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    );
}

export default AdminDashboard