import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import TopicCard from '../components/ui/TopicCard';
import PageHeader from '../components/ui/PageHeader';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import { getTopics } from '../services/topicService'; // 1. Pastikan service di-import

// Varian animasi halaman
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};
const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const HomePage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    
    // 2. State untuk menampung data dari API dan status loading/error
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. useEffect untuk mengambil data dari backend saat komponen dimuat atau bahasa berubah
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                setIsLoading(true);
                const data = await getTopics(i18n.language);
                setTopics(data.topics || []);
                setError(null);
            } catch (err) {
                setError("Gagal memuat topik dari server.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopics();
    }, [i18n.language]); // Dependensi pada i18n.language agar data di-fetch ulang saat bahasa diganti

    const handleTopicClick = (topicId) => {
        navigate(`/topik/${topicId}`);
    };
    
    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="px-4 sm:px-6 lg:px-8 py-8" 
        >
            <div className="max-w-7xl mx-auto">
                <PageHeader title={t('welcomeMessage')} />
            
                {error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                        {/* 4. Map data dari state 'topics', bukan dari MOCK_TOPICS */}
                        {topics.map((topic) => (
                            <TopicCard 
                                key={topic._id}
                                title={topic.topicName}
                                // 5. Tambahkan URL base backend ke path gambar
                                imageUrl={`http://localhost:5000${topic.topicImagePath}`}
                                onClick={() => handleTopicClick(topic._id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default HomePage;