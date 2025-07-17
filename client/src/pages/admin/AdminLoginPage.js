import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService'; // 1. Import admin service

const logo = '/assets/images/logo-kang-agam.png';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [credentials, setCredentials] = useState({ adminEmail: '', adminPassword: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // 2. Logika handle submit yang sudah terhubung ke backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Panggil service login, bukan logika hardcode
            const userData = await adminService.login(credentials);
            login(userData); // Simpan data ke context setelah berhasil
            navigate('/admin/dashboard');
        } catch (err) {
            // Tangkap error dari backend dan tampilkan pesannya
            const errorMessage = err.response?.data?.message || "Login gagal. Periksa kembali koneksi Anda.";
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#E9EAEF] min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
                <div className="text-center md:text-left flex-shrink-0">
                    <img src={logo} alt="Kang Agam Logo" className="w-56 mx-auto md:mx-0" />
                    <p className="text-gray-700 mt-4">Kamus Daring Audio Bergambar Tiga Bahasa</p>
                    <p className="text-sm text-gray-500">Indonesia / Sunda / Inggris</p>
                </div>

                <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Masuk sebagai Admin</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input type="email" id="adminEmail" name="adminEmail" value={credentials.adminEmail} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
                        </div>
                        <div>
                            <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                            <input type="password" id="adminPassword" name="adminPassword" value={credentials.adminPassword} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button 
                            type="submit" 
                            className="w-full bg-[#8DA2FB] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#788DE5] transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;