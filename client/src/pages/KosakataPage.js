import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

import KosakataCard from '../components/ui/KosakataCard';
import PageHeader from '../components/ui/PageHeader';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import Pagination from '../components/ui/Pagination';
import { getEntriesByTopicId } from '../services/entryService';
import { getTopicById } from '../services/topicService';

// Hook untuk mendeteksi ukuran layar
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(window.matchMedia(query).matches);

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
};

// Varian animasi
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
            staggerChildren: 0.05,
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

const ENTRIES_PER_PAGE = 12;

const KosakataPage = () => {
    const { topicId } = useParams();
    const { t, i18n } = useTranslation();
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const pageTopRef = useRef(null);
    const activeCardRef = useRef(null);

    const [topicInfo, setTopicInfo] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeEntry, setActiveEntry] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
                const [topicData, entriesData] = await Promise.all([
                    getTopicById(topicId),
                    getEntriesByTopicId(topicId),
                    minDelay
                ]);

                setTopicInfo(topicData.topic);
                setEntries(entriesData.entries || []);

                if (entriesData.entries && entriesData.entries.length > 0) {
                    setActiveEntry(entriesData.entries[0]);
                }
                setError(null);
                
            } catch (err) {
                setError("Gagal memuat data dari server.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [topicId]);

    const findVocab = (entry, lang) => {
        if (!entry || !entry.entryVocabularies) return null;
        return entry.entryVocabularies.find(v => v.language.languageCode === lang) || entry.entryVocabularies[0];
    };
    
    const getTranslatedTopicName = () => {
        if (!topicInfo || !Array.isArray(topicInfo.topicName)) return 'Memuat...';
        const currentTranslation = topicInfo.topicName.find(t => t.lang === i18n.language);
        if (currentTranslation) return currentTranslation.value;
        const fallback = topicInfo.topicName.find(t => t.lang === 'id') || topicInfo.topicName[0];
        return fallback ? fallback.value : 'Judul Topik';
    };

    const filteredEntries = entries.filter(entry => {
        const vocab = findVocab(entry, i18n.language);
        return vocab && vocab.vocab.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filteredEntries.length / ENTRIES_PER_PAGE);
    const indexOfLastItem = currentPage * ENTRIES_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ENTRIES_PER_PAGE;
    const paginatedEntries = filteredEntries.slice(indexOfFirstItem, indexOfLastItem);
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        if (pageTopRef.current) {
            const scrollableContainer = pageTopRef.current.closest('.stable-scrollbar');
            if (scrollableContainer) {
                scrollableContainer.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const handleCardClick = (entry) => {
        if (isAudioPlaying) return;
        setActiveEntry(entry);
        
        const audioUrl = findVocab(entry, i18n.language)?.audioUrl;
        if (!audioUrl) return;

        if (audioRef.current) {
            audioRef.current.pause();
        }

        const audio = new Audio(`http://localhost:5000${audioUrl.replace(/\\/g, '/')}`);
        audioRef.current = audio;
        setIsAudioPlaying(true);

        let playCount = 0;
        const handleAudioEnd = () => {
            playCount++;
            if (playCount < 2) {
                audio.currentTime = 0;
                audio.play();
            } else {
                setIsAudioPlaying(false);
                audio.removeEventListener('ended', handleAudioEnd);
            }
        };
        audio.addEventListener('ended', handleAudioEnd);
        audio.play();
    };

    const entriesToDisplay = isDesktop ? filteredEntries : paginatedEntries;

    // ✅ 1. Logika kuis dinonaktifkan jika kosakata < 5
    const isQuizDisabled = !entries || entries.length < 5;

    if (isLoading) {
        return <LoadingIndicator />;
    }

    const DetailPanel = () => {
        const languageOrder = ['id', 'su', 'en'];
        const mainLang = i18n.language;
        const otherLangs = languageOrder.filter(lang => lang !== mainLang);

        return (
            <div ref={activeCardRef}>
                <div className="bg-background-secondary rounded-2xl shadow-inner overflow-hidden">
                    <div className="aspect-square">
                        {activeEntry ? (
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeEntry._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    src={`http://localhost:5000${activeEntry.entryImagePath.replace(/\\/g, '/')}`} 
                                    alt="Gambar kosakata" 
                                    className="w-full h-full object-cover" 
                                />
                            </AnimatePresence>
                        ) : (
                            <div className="flex items-center justify-center text-text-secondary h-full">Pilih kosakata</div>
                        )}
                    </div>
                </div>
                {activeEntry && (
                    <div className="mt-4 text-center bg-background-secondary p-4 rounded-2xl shadow-md">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeEntry._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <p className="text-2xl font-bold text-text">{findVocab(activeEntry, mainLang)?.vocab}</p>
                                {otherLangs.map(lang => (
                                    <p key={lang} className="text-lg text-text-secondary">{findVocab(activeEntry, lang)?.vocab}</p>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            ref={pageTopRef}
        >
            <div className="sticky top-0 z-20 bg-background pt-4 pb-4 border-b border-gray-200 dark:border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <PageHeader 
                                title={getTranslatedTopicName()}
                                visitCount={topicInfo?.visitCount}
                            />
                            <div className='flex items-center gap-4 w-full sm:w-auto'>
                                <Link 
                                    to={isQuizDisabled ? '#' : `/quiz/${topicId}`}
                                    onClick={(e) => isQuizDisabled && e.preventDefault()}
                                    className={`flex-1 text-center font-bold px-4 py-2 rounded-lg text-sm transition-opacity ${
                                        isQuizDisabled 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-primary text-white hover:opacity-90'
                                    }`}
                                    title={isQuizDisabled ? "Kuis membutuhkan minimal 5 kosakata" : "Mulai Kuis"}
                                >
                                    {t('quizButton')}
                                </Link>
                                <Link to="/home" className="flex-1 items-center justify-center gap-2 bg-background-secondary text-text-secondary font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 whitespace-nowrap hidden sm:flex">
                                    <span>←</span>
                                    <span>{t("backButton")}</span>
                                </Link>
                                <Link to="/home" className="flex-1 text-center bg-background-secondary text-text-secondary font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 sm:hidden">
                                    ← {t("backButton")}
                                </Link>
                            </div>
                        </div>
                        
                        <div className="relative w-full sm:max-w-xs sm:self-end">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                placeholder="Cari kosakata..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-background-secondary text-text focus:ring-1 focus:ring-primary focus:border-primary shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 mt-8">
                {error && <p className="text-center text-red-500">{error}</p>}

                {!error && !isLoading && entries.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">Kosakata belum tersedia, ditunggu yah {'>'}.{'<'}</p>
                    </div>
                )}
                
                {!error && entries.length > 0 && (
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                        {isDesktop && (
                            <div className="lg:col-span-1">
                                <div className="lg:sticky lg:top-40 z-10">
                                    <DetailPanel />
                                </div>
                            </div>
                        )}
                        
                        {/* ✅ 2. Kolom ini sekarang mengambil lebar penuh di semua ukuran layar */}
                        <div className={isDesktop ? "lg:col-span-2" : "w-full"}>
                            {/* ✅ 3. Panel detail TIDAK LAGI dirender di mobile */}
                            {entriesToDisplay.length > 0 ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentPage}
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                                    >
                                        {entriesToDisplay.map((entry) => {
                                            const currentVocab = findVocab(entry, i18n.language);
                                            if (!currentVocab) return null;

                                            return (
                                                <motion.div key={entry._id} variants={cardVariants}>
                                                    <KosakataCard 
                                                        content={currentVocab.vocab}
                                                        imageUrl={`http://localhost:5000${entry.entryImagePath.replace(/\\/g, '/')}`}
                                                        isActive={activeEntry && activeEntry._id === entry._id}
                                                        isPlaying={isAudioPlaying && activeEntry?._id === entry._id}
                                                        isAnyAudioPlaying={isAudioPlaying}
                                                        onCardClick={() => handleCardClick(entry)}
                                                    />
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-xl text-gray-500">Kosakata yang Anda cari tidak ditemukan.</p>
                                </div>
                            )}
                            {!isDesktop && (
                                <div className="mt-12 pt-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        totalItems={filteredEntries.length}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default KosakataPage;