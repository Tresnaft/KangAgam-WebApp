import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Import komponen UI dan Service
import KosakataCard from '../components/ui/KosakataCard';
import PageHeader from '../components/ui/PageHeader';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import { getTopicById } from '../services/topicService';
import { getEntriesByTopicId } from '../services/entryService';

// Gunakan varian animasi yang sama untuk konsistensi
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

const KosakataPage = () => {
    const { topicId } = useParams();
    const { t, i18n } = useTranslation();

    const [topic, setTopic] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const startTime = Date.now();

        const fetchAllData = async () => {
            try {
                const topicDataPromise = getTopicById(topicId);
                const entriesDataPromise = getEntriesByTopicId(topicId);

                const [topicResponse, entriesResponse] = await Promise.all([
                    topicDataPromise,
                    entriesDataPromise
                ]);
                
                setTopic(topicResponse.topic);
                setEntries(entriesResponse.entries);
            } catch (error) {
                console.error("Gagal mengambil data untuk halaman kosakata.", error);
            } finally {
                const elapsedTime = Date.now() - startTime;
                const minDuration = 400;

                if (elapsedTime < minDuration) {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, minDuration - elapsedTime);
                } else {
                    setIsLoading(false);
                }
            }
        };

        setIsLoading(true);
        fetchAllData();
    }, [topicId]);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (!topic) {
        return <div className="text-center p-10">Topik tidak ditemukan.</div>;
    }

    const pageTitle =
        topic.topicName.find(n => n.lang === i18n.language)?.value ||
        topic.topicName.find(n => n.lang === 'id')?.value ||
        "Detail Topik";

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="relative w-full"
        >
            <PageHeader title={pageTitle}>
                <div className='flex items-center gap-4'>
                    <Link to={`/quiz/${topicId}`} className="bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-lg text-sm hover:bg-blue-200">
                        {t('quizButton')}
                    </Link>
                    <Link to="/home" className="text-sm text-gray-600 hover:text-black">
                        ← {t('backButton')}
                    </Link>
                </div>
            </PageHeader>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 max-w-full mx-auto px-4">
                {entries.map((entry) => {
                    const vocabToDisplay = 
                        entry.entryVocabularies.find(v => v.language.languageCode === i18n.language)?.vocab ||
                        entry.entryVocabularies.find(v => v.language.languageCode === 'id')?.vocab ||
                        'N/A';

                    return (
                        <KosakataCard 
                            key={entry._id} 
                            content={vocabToDisplay} 
                        />
                    );
                })}
            </div>
        </motion.div>
    );
};

export default KosakataPage;