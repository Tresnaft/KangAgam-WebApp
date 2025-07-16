import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import TopicCard from '../components/ui/TopicCard';
import PageHeader from '../components/ui/PageHeader';
import LoadingIndicator from '../components/ui/LoadingIndicator';

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

// Data simulasi dengan path gambar
const MOCK_TOPICS = [
    { _id: 'abjad', topicName: 'Abjad', topicImagePath: '/assets/images/topic/abjad.png' },
    { _id: 'angka', topicName: 'Angka', topicImagePath: '/assets/images/topic/angka.png' },
    { _id: 'buah', topicName: 'Buah', topicImagePath: '/assets/images/topic/buah.png' },
    { _id: 'binatang', topicName: 'Binatang', topicImagePath: '/assets/images/topic/binatang.png' },
    { _id: 'anggotaTubuh', topicName: 'Anggota Tubuh', topicImagePath: '/assets/images/topic/anggota-tubuh.png' },
    { _id: 'warna', topicName: 'Warna', topicImagePath: '/assets/images/topic/warna.png' },
    { _id: 'bentuk', topicName: 'Bentuk', topicImagePath: '/assets/images/topic/bentuk.png' },
    { _id: 'profesi', topicName: 'Profesi', topicImagePath: '/assets/images/topic/profesi.png' },
    { _id: 'sayuran', topicName: 'Sayuran', topicImagePath: '/assets/images/topic/sayuran.png' },
    { _id: 'kuliner', topicName: 'Kuliner', topicImagePath: '/assets/images/topic/kuliner.png' },
];


const HomePage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const startTime = Date.now();
        
        const translatedTopics = MOCK_TOPICS.map(topic => ({
            ...topic,
            topicName: t(`topics.${topic._id}`)
        }));
        setTopics(translatedTopics);

        const elapsedTime = Date.now() - startTime;
        const minDuration = 400; 

        setTimeout(() => {
            setIsLoading(false);
        }, Math.max(0, minDuration - elapsedTime));
        
    }, [i18n.language, t]);

    const handleTopicClick = (topicId) => {
        navigate(`/topik/${topicId}`);
    };
    
    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        // FIX: Mengubah padding horizontal (px) dan vertikal (py)
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
            
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {topics.map((topic) => (
                        <TopicCard 
                            key={topic._id}
                            title={topic.topicName}
                            imageUrl={topic.topicImagePath}
                            onClick={() => handleTopicClick(topic._id)}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default HomePage;