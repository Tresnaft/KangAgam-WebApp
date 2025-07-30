import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import TopicCard from '../components/ui/TopicCard';
import PageHeader from '../components/ui/PageHeader';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import Pagination from '../components/ui/Pagination';
import InfoModal from '../components/ui/InfoModal'; // ✅ 1. Impor komponen modal baru
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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08, 
        },
    },
};

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
        },
    },
};

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const TOPICS_PER_PAGE = 10;

const HomePage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    // ✅ 2. Tambahkan state untuk mengontrol modal info
    const [infoModal, setInfoModal] = useState({ isOpen: false, title: '', message: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
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

    // ✅ 3. Perbarui logika klik topik
    const handleTopicClick = (topic) => {
        // Cek jika topik memiliki kosakata
        if (!topic.topicEntries || topic.topicEntries.length === 0) {
            setInfoModal({
                isOpen: true,
                title: 'Informasi',
                message: 'Topik ini belum memiliki kosakata, ditunggu yah!',
            });
            return; // Hentikan navigasi
        }

        // Jika ada kosakata, lanjutkan seperti biasa
        if (user && user._id) {
            logVisit({
                learnerId: user._id,
                topicId: topic._id,
            });
        }
        navigate(`/topik/${topic._id}`);
    };

    const filteredTopics = topics.filter(topic =>
        topic.topicName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredTopics.length / TOPICS_PER_PAGE);
    const indexOfLastItem = currentPage * TOPICS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - TOPICS_PER_PAGE;
    const currentTopics = filteredTopics.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);


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
            className="flex flex-col min-h-full"
        >
            <div className="sticky top-0 z-10 bg-background border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <PageHeader title={t('welcomeMessage')} />
                        <div className="relative w-full sm:w-auto">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                placeholder="Cari topik..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-background-secondary text-text focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full flex flex-col">
                {error ? (
                    <p className="text-center text-red-500 mt-8">{error}</p>
                ) : (
                    <>
                        {!isLoading && filteredTopics.length === 0 ? (
                            <div className="text-center py-20 flex-grow flex items-center justify-center">
                                <p className="text-xl text-text-secondary">Topik belum tersedia, ditunggu yah {'>'}.{'<'}</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex-grow">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentPage}
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-12"
                                        >
                                            {currentTopics.map((topic) => (
                                                <motion.div key={topic._id} variants={cardVariants}>
                                                    {/* ✅ 4. Kirim seluruh objek 'topic' ke handler */}
                                                    <TopicCard
                                                        title={topic.topicName}
                                                        imageUrl={`http://localhost:5000${topic.topicImagePath}`}
                                                        onClick={() => handleTopicClick(topic)}
                                                        visitCount={topic.visitCount}
                                                    />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                                
                                <div className="mt-auto pt-8 pb-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        totalItems={filteredTopics.length}
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
            
            {/* ✅ 5. Render modal di sini */}
            <InfoModal 
                isOpen={infoModal.isOpen}
                onClose={() => setInfoModal({ isOpen: false, title: '', message: '' })}
                title={infoModal.title}
                message={infoModal.message}
            />
        </motion.div>
    );
};

export default HomePage;