import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo-kang-agam.png'; // Pastikan path logo benar

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    // Cek: jika sudah login sebagai admin, langsung ke dashboard
    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // --- Simulasi Login Admin ---
        // Di aplikasi nyata, di sini kamu akan memanggil API ke backend
        if (credentials.email === 'admin@kangagam.com' && credentials.password === 'password123') {
            const adminData = {
                email: credentials.email,
                role: 'admin'
            };
            login(adminData);
            navigate('/admin/dashboard');
        } else {
            setError('Email atau password salah.');
        }
    };

    return (
        // Layout Utama: Latar belakang biru keabuan, flexbox untuk centering
        <div className="bg-[#E9EAEF] min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans">
            
            {/* Wrapper 2 Kolom */}
            <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">

                {/* === KOLOM KIRI: BRANDING === */}
                <div className="text-center md:text-left flex-shrink-0">
                    <img src={logo} alt="Kang Agam Logo" className="w-56 mx-auto md:mx-0" />
                    <p className="text-gray-700 mt-4">Kamus Daring Audio Bergambar Tiga Bahasa</p>
                    <p className="text-sm text-gray-500">Indonesia / Sunda / Inggris</p>
                    <p className="text-xs text-gray-400 mt-12">Balai Bahasa Provinsi Jawa Barat</p>
                </div>

                {/* === KOLOM KANAN: KARTU FORM === */}
                <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Masuk sebagai Admin</h2>
                    
                    {/* Kotak Info/Alert */}
                    <div className="bg-[#FFEFE3] text-[#D96F43] text-sm p-3 rounded-lg flex items-center gap-3 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>Isi terlebih dahulu data diri dibawah ini</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input type="email" name="email" onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition" required />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                                <Link to="#" className="text-xs text-blue-500 hover:underline">Lupa password?</Link>
                            </div>
                            <input type="password" name="password" onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition" required />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button type="submit" className="w-full bg-[#8DA2FB] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#788DE5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8DA2FB] transition-colors">
                            Masuk
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;