import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';

const logo = '/assets/images/logo-kang-agam.png';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({ adminEmail: '', adminPassword: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'superadmin') {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
    };

    // ✅ PERBAIKAN: Menambahkan validasi format email
    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Pola email sederhana

        if (!formData.adminEmail.trim()) {
            newErrors.adminEmail = 'Email wajib diisi.';
        } else if (!emailRegex.test(formData.adminEmail)) {
            newErrors.adminEmail = 'Format email tidak valid.';
        }

        if (!formData.adminPassword.trim()) {
            newErrors.adminPassword = 'Password wajib diisi.';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await adminService.login(formData);
            login(response); 
        } catch (err) {
            setErrors({ general: err.response?.data?.message || 'Gagal login. Periksa kredensial Anda.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#EBF0FF] min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans">
            <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-10 md:gap-20">
                
                <div className="flex flex-col w-full max-w-sm text-center md:text-left py-5">
                    <div>
                        <img src={logo} alt="Kang Agam Logo" className="w-56 mx-auto md:mx-0" />
                        <p className="text-gray-700 mt-4">Kamus Daring Audio Bergambar Tiga Bahasa</p>
                        <p className="text-sm text-gray-500">Panel Khusus Administrator</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-auto">Balai Bahasa Provinsi Jawa Barat</p>
                </div>

                <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Login Admin</h2>
                    {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input 
                                type="email" 
                                name="adminEmail" 
                                value={formData.adminEmail} 
                                onChange={handleChange} 
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-300 ${errors.adminEmail ? 'border-red-500' : 'border-gray-300'}`} 
                            />
                            {errors.adminEmail && <p className="text-red-500 text-xs mt-1">{errors.adminEmail}</p>}
                        </div>
                        <div>
                            <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                            <input 
                                type="password" 
                                name="adminPassword" 
                                value={formData.adminPassword} 
                                onChange={handleChange} 
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-300 ${errors.adminPassword ? 'border-red-500' : 'border-gray-300'}`} 
                            />
                            {errors.adminPassword && <p className="text-red-500 text-xs mt-1">{errors.adminPassword}</p>}
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-[#5270FD] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#425AD9] disabled:opacity-50 transition-colors">
                            {isSubmitting ? 'Memproses...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;