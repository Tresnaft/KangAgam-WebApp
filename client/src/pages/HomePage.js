import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import komponen & aset
import TopicCard from '../components/ui/TopicCard';
import logo from '../assets/images/logo-kang-agam.png'; // Sesuaikan jika perlu

// Import gambar-gambar topik (Cara terbaik agar dibundle oleh React)
// import abjadImg from '../assets/images/topics/abjad.png';
// import angkaImg from '../assets/images/topics/angka.png';
// import buahImg from '../assets/images/topics/buah.png';
// import binatangImg from '../assets/images/topics/binatang.png';
// import anggotaTubuhImg from '../assets/images/topics/anggota-tubuh.png';
// import warnaImg from '../assets/images/topics/warna.png';
// import bentukImg from '../assets/images/topics/bentuk.png';
// import profesiImg from '../assets/images/topics/profesi.png';
// import sayuranImg from '../assets/images/topics/sayuran.png';
// import kulinerImg from '../assets/images/topics/kuliner.png';

const topics = [
    { name: 'Abjad', image: null }, // Ganti semua path gambar menjadi null
    { name: 'Angka', image: null },
    { name: 'Buah', image: null },
    { name: 'Binatang', image: null },
    { name: 'Anggota Tubuh', image: null },
    { name: 'Warna', image: null },
    { name: 'Bentuk', image: null },
    { name: 'Profesi', image: null },
    { name: 'Sayuran', image: null },
    { name: 'Kuliner', image: null },
];

const HomePage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleTopicClick = (topicName) => {
        // Nanti di sini kita akan navigasi ke halaman detail topik
        console.log(`Topik diklik: ${topicName}`);
        // Contoh navigasi: navigate(`/topik/${topicName.toLowerCase()}`);
    };

    return (
        <div className="bg-[#FFFBEB] min-h-screen p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8">

                {/* === BAGIAN NAVBAR === */}
                <header className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <img src={logo} alt="Kang Agam Logo" className="h-10 w-auto" />
                    <nav className="flex items-center gap-4 sm:gap-6">
                        <a href="#" className="text-sm text-gray-600 hover:text-black font-medium">Menu A</a>
                        <a href="#" className="text-sm text-gray-600 hover:text-black font-medium">Menu B</a>
                        <button 
                            onClick={handleLogout}
                            className="bg-[#FCE0E0] text-[#D95353] text-sm font-bold px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            Keluar
                        </button>
                    </nav>
                </header>

                {/* === BAGIAN KONTEN UTAMA === */}
                <main className="mt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Silahkan Pilih Topik</h1>
                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                            <label htmlFor="bahasa" className="text-sm font-medium text-gray-700">Bahasa:</label>
                            <select id="bahasa" name="bahasa" className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-indigo-500">
                                <option>Indonesia</option>
                                <option>Sunda</option>
                                <option>Inggris</option>
                            </select>
                        </div>
                    </div>

                    {/* Grid Topik */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                        {topics.map((topic) => (
                            <TopicCard 
                                key={topic.name}
                                title={topic.name}
                                imageUrl={topic.image}
                                onClick={() => handleTopicClick(topic.name)}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HomePage;