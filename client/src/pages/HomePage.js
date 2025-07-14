import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TopicCard from '../components/ui/TopicCard';
import PageHeader from '../components/ui/PageHeader';
import { getTopics } from '../services/topicService'; // <-- 1. Import service kita

const HomePage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    
    // 2. Buat state untuk menampung data topik dari API
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // State untuk loading

    // 3. Gunakan useEffect untuk mengambil data saat komponen dimuat
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                setIsLoading(true); // Mulai loading
                // Ambil topik sesuai bahasa yang aktif di i18n
                const data = await getTopics(i18n.language);
                setTopics(data.topics); // Simpan data ke state
            } catch (error) {
                console.error("Gagal mengambil data topik di komponen Home.", error);
                // Di sini Anda bisa menambahkan state untuk menampilkan pesan error di UI
            } finally {
                setIsLoading(false); // Selesai loading
            }
        };

        fetchTopics();
    }, [i18n.language]); // <-- 4. Jalankan ulang useEffect jika bahasa berubah

    const handleTopicClick = (topicId) => {
        // 5. Navigasi menggunakan _id dari topik
        navigate(`/topik/${topicId}`);
    };
    
    // Tampilkan pesan loading
    if (isLoading) {
        return <div className="text-center">Memuat topik...</div>
    }

    return (
        <>
            <PageHeader title={t('welcomeMessage')} />
            
            {/* 6. Gunakan state 'topics' untuk me-render TopicCard */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {topics.map((topic) => (
                    <TopicCard 
                        key={topic._id}
                        title={topic.topicName} // Backend sudah memberikan nama yang diterjemahkan
                        imageUrl={topic.topicImagePath} // Gunakan path gambar dari API
                        onClick={() => handleTopicClick(topic._id)}
                    />
                ))}
            </div>
        </>
    );
};

export default HomePage;