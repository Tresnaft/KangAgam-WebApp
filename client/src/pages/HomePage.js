import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import komponen UI dan Service
import TopicCard from '../components/ui/TopicCard';
import PageHeader from '../components/ui/PageHeader';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import { getTopics } from '../services/topicService';

// Definisikan varian animasi di luar komponen
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
    
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Tandai waktu mulai saat fetch dimulai
        const startTime = Date.now();

        const fetchTopics = async () => {
            try {
                const data = await getTopics(i18n.language);
                setTopics(data.topics);
            } catch (error) {
                console.error("Gagal mengambil data topik di HomePage.", error);
            } finally {
                // Hitung berapa lama proses fetch berlangsung
                const elapsedTime = Date.now() - startTime;
                const minDuration = 400; // Durasi minimum loading (dalam milidetik)

                if (elapsedTime < minDuration) {
                    // Jika fetch terlalu cepat, tunggu sisa waktunya
                    setTimeout(() => {
                        setIsLoading(false);
                    }, minDuration - elapsedTime);
                } else {
                    // Jika fetch sudah cukup lama, langsung hilangkan loading
                    setIsLoading(false);
                }
            }
        };

        // Selalu set loading ke true saat useEffect berjalan
        setIsLoading(true);
        fetchTopics();
        
    }, [i18n.language]);

    const handleTopicClick = (topicId) => {
        navigate(`/topik/${topicId}`);
    };
    
    // Tampilkan loading indicator hanya berdasarkan state isLoading
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
            // Kelas 'absolute' adalah kunci untuk mencegah flicker/layout shift
            className="absolute w-full"
        >
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
        </motion.div>
    );
};

export default HomePage;