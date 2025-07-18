import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import TopicCard from '../components/ui/TopicCard';
import PageHeader from '../components/ui/PageHeader';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import { getTopics } from '../services/topicService';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth
import { logVisit } from '../services/visitorLogService'; // 2. Import service baru

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
    const { user } = useAuth(); // 3. Dapatkan data user (learner)
    
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
    }, [i18n.language]);

    // 4. Modifikasi handleTopicClick
    const handleTopicClick = (topicId) => {
        // Pastikan kita punya ID pengguna sebelum mencatat
        if (user && user._id) {
            // Kirim log ke backend tanpa menunggu hasilnya (fire and forget)
            // agar tidak memperlambat navigasi pengguna.
            logVisit({
                learnerId: user._id,
                topicId: topicId,
            });
        }
        // Langsung navigasi tanpa menunggu log selesai
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
                        {topics.map((topic) => (
                            <TopicCard 
                                key={topic._id}
                                title={topic.topicName}
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