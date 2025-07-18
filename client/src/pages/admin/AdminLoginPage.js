import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';

const logo = '/assets/images/logo-kang-agam.png';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    // FIX: Gunakan nama field yang benar: adminEmail dan adminPassword
    const [formData, setFormData] = useState({ adminEmail: '', adminPassword: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await adminService.login(formData);
            if (response?.role === 'admin') {
                login(response);
            } else {
                setError('Akses ditolak. Anda bukan admin.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal login. Periksa kredensial Anda.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#FFFBEB] min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Login Admin</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        {/* FIX: Sesuaikan nama dan label input */}
                        <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input type="email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
                    </div>
                    <div>
                        <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                        <input type="password" name="adminPassword" value={formData.adminPassword} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#8DA2FB] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#788DE5] disabled:opacity-50">
                        {isSubmitting ? 'Memproses...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;