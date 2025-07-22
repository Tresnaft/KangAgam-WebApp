import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Select from 'react-select';

const logo = '/assets/images/logo-kang-agam.png';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    
    const [formData, setFormData] = useState({
        namaLengkap: '',
        nomorTelepon: '',
    });
    // Mengganti nama state agar lebih jelas
    const [selectedCity, setSelectedCity] = useState(null); 
    const [cityOptions, setCityOptions] = useState([]);
    const [isLoadingCities, setIsLoadingCities] = useState(true);

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/locations/cities'); 
                const cityData = response.data.map(city => ({
                    value: city.name,
                    label: city.name,
                }));
                setCityOptions(cityData);
            } catch (err) {
                console.error("Gagal memuat data domisili:", err);
                setCityOptions([{ value: 'Lainnya', label: 'Lainnya' }]);
            } finally {
                setIsLoadingCities(false);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        if (user && user.role === 'user') {
            navigate('/home', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!formData.namaLengkap.trim() || !selectedCity) {
            setError('Harap isi nama lengkap dan pilih asal domisili.');
            setIsSubmitting(false);
            return;
        }

        try {
            // --- PERUBAHAN DI SINI ---
            // Mengirim data dengan field 'learnerCity'
            const learnerData = {
                learnerName: formData.namaLengkap,
                learnerPhone: formData.nomorTelepon,
                learnerCity: selectedCity.value, 
            };
            const response = await axios.post('http://localhost:5000/api/learners', learnerData);
            
            const userData = { ...response.data.data, role: 'user' };
            login(userData);
            navigate('/home', { replace: true });

        } catch (err) {
            console.error('Error details:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Gagal menyimpan data. Coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#FFFBEB] min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans">
            <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-10 md:gap-20">
                <div className="flex flex-col w-full max-w-sm text-center md:text-left py-5">
                    <div>
                        <img src={logo} alt="Kang Agam Logo" className="w-56 mx-auto md:mx-0" />
                        <p className="text-gray-700 mt-4">Kamus Daring Audio Bergambar Tiga Bahasa</p>
                        <p className="text-sm text-gray-500">Indonesia / Sunda / Inggris</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-auto">Balai Bahasa Provinsi Jawa Barat</p>
                </div>
                <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Data Diri</h2>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="bg-[#FFEFE3] text-[#D96F43] text-sm p-3 rounded-lg flex items-center gap-3 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>Isi terlebih dahulu data diri dibawah ini</span>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="namaLengkap" className="block text-sm font-medium text-gray-600 mb-1">Nama Lengkap</label>
                            <input type="text" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
                        </div>
                        <div>
                            <label htmlFor="nomorTelepon" className="block text-sm font-medium text-gray-600 mb-1">Nomor Telepon (Opsional)</label>
                            <input type="tel" name="nomorTelepon" value={formData.nomorTelepon} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="asalDomisili" className="block text-sm font-medium text-gray-600 mb-1">Asal Domisili (Kota/Kabupaten)</label>
                            <Select
                                id="asalDomisili"
                                name="asalDomisili"
                                value={selectedCity}
                                onChange={handleCityChange}
                                options={cityOptions}
                                isLoading={isLoadingCities}
                                placeholder="Cari dan pilih kota/kabupaten..."
                                isClearable
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                    control: (base) => ({
                                        ...base,
                                        padding: '0.3rem',
                                        borderRadius: '0.5rem',
                                        borderColor: '#D1D5DB',
                                    }),
                                }}
                            />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-[#8DA2FB] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#788DE5]">
                            {isSubmitting ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;