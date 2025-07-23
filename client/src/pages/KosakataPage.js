import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import KosakataCard from '../components/ui/KosakataCard';
import PageHeader from '../components/ui/PageHeader';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import { getEntriesByTopicId } from '../services/entryService';
import { getTopicById } from '../services/topicService';

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

const KosakataPage = () => {
    const { topicId } = useParams();
    const { t, i18n } = useTranslation();

    const [topicInfo, setTopicInfo] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeEntry, setActiveEntry] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const minDelay = new Promise(resolve => setTimeout(resolve, 3000));
                const topicDataFetch = getTopicById(topicId);
                const entriesDataFetch = getEntriesByTopicId(topicId);

                const [topicData, entriesData] = await Promise.all([
                    topicDataFetch,
                    entriesDataFetch,
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

    if (isLoading) {
        return <LoadingIndicator />;
    }

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

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <div className="sticky top-0 z-10 bg-[#FFFBEB] border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-5">
                        <PageHeader 
                            title={getTranslatedTopicName()}
                            visitCount={topicInfo?.visitCount}
                        >
                            <div className='flex items-center gap-4'>
                                <Link to={`/quiz/${topicId}`} className="bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-lg text-sm hover:bg-blue-200">{t('quizButton')}</Link>
                                <Link to="/home" className="text-sm text-gray-600 hover:text-black">&larr; {t("backButton")}</Link>
                            </div>
                        </PageHeader>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {error && <p className="text-center text-red-500">{error}</p>}

                {!error && !isLoading && entries.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">Kosakata belum tersedia, ditunggu yah {'>'}.{'<'}</p>
                    </div>
                )}
                
                {!error && entries.length > 0 && (
                    // --- PERBAIKAN DI SINI ---
                    // Menghapus 'lg:items-start' agar kolom kiri bisa meregang setinggi kolom kanan
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8 mt-8">
                        {/* --- Kolom Kiri (Kotak Merah) --- */}
                        <div className="lg:col-span-4">
                            {/* Mengembalikan ke 'sticky' dengan posisi yang sudah disesuaikan */}
                            <div className="lg:sticky top-32">
                                <div className="bg-gray-100 rounded-2xl shadow-inner overflow-hidden">
                                    <div className="aspect-square">
                                        {activeEntry ? (
                                            <img src={`http://localhost:5000${activeEntry.entryImagePath.replace(/\\/g, '/')}`} alt="Gambar kosakata" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center text-gray-400 h-full">Pilih kosakata</div>
                                        )}
                                    </div>
                                </div>
                                {activeEntry && (
                                    <div className="mt-4 text-center bg-white p-4 rounded-2xl shadow-md">
                                        <p className="text-2xl font-bold text-gray-800">{findVocab(activeEntry, 'id')?.vocab}</p>
                                        <p className="text-lg text-gray-600">{findVocab(activeEntry, 'su')?.vocab}</p>
                                        <p className="text-lg text-gray-500 italic">{findVocab(activeEntry, 'en')?.vocab}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- Kolom Kanan (Kotak Hijau) --- */}
                        <div className="lg:col-span-8 mt-8 lg:mt-0">
                            {/* Menambahkan padding bawah untuk memberi ruang scroll di akhir */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-32">
                                {entries.map((entry) => {
                                    const currentVocab = findVocab(entry, i18n.language);
                                    if (!currentVocab) return null;

                                    return (
                                        <KosakataCard 
                                            key={entry._id} 
                                            content={currentVocab.vocab}
                                            imageUrl={`http://localhost:5000${entry.entryImagePath.replace(/\\/g, '/')}`}
                                            audioUrl={`http://localhost:5000${currentVocab.audioUrl.replace(/\\/g, '/')}`}
                                            isActive={activeEntry && activeEntry._id === entry._id}
                                            onCardClick={() => setActiveEntry(entry)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default KosakataPage;