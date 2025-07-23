import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import TopicCard from '../components/ui/TopicCard';
import PageHeader from '../components/ui/PageHeader';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import { getTopics } from '../services/topicService';
import { useAuth } from '../context/AuthContext';
import { logVisit } from '../services/visitorLogService';

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
    const { user } = useAuth();

    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                const minDelay = new Promise(resolve => setTimeout(resolve, 3000));
                const dataFetch = getTopics(i18n.language);

                const [data] = await Promise.all([dataFetch, minDelay]);
                
                setTopics(data.topics || []);
                setError(null);
            } catch (err) {
                setError("Gagal memuat topik dari server.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [i18n.language]);

    const handleTopicClick = (topicId) => {
        if (user && user._id) {
            logVisit({
                learnerId: user._id,
                topicId: topicId,
            });
        }
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
            className="pb-32"
        >
            {/* --- PERBAIKAN 1: Wrapper Header Sticky Full-Width --- */}
            <div className="sticky top-0 z-10 bg-[#FFFBEB] border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-5">
                        <PageHeader title={t('welcomeMessage')} />
                    </div>
                </div>
            </div>

            {/* --- PERBAIKAN 2: Wrapper Konten Utama --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {error ? (
                    <p className="text-center text-red-500 mt-8">{error}</p>
                ) : (
                    // Menambahkan margin atas agar tidak terlalu dekat dengan header
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-8">
                        {topics.map((topic) => (
                            <TopicCard
                                key={topic._id}
                                title={topic.topicName}
                                imageUrl={`http://localhost:5000${topic.topicImagePath}`}
                                onClick={() => handleTopicClick(topic._id)}
                                visitCount={topic.visitCount}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default HomePage;