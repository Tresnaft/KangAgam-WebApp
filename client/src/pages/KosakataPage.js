import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import KosakataCard from '../components/ui/KosakataCard';
import PageHeader from '../components/ui/PageHeader';
import { getTopicById } from '../services/topicService';
import { getEntriesByTopicId } from '../services/entryService'; // <-- 1. Import service baru

const KosakataPage = () => {
    const { topicId } = useParams();
    const { t, i18n } = useTranslation();

    const [topic, setTopic] = useState(null);
    const [entries, setEntries] = useState([]); // <-- 2. State untuk menampung kosakata
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);
                // Ambil data detail topik dan data kosakata secara bersamaan
                const topicDataPromise = getTopicById(topicId);
                const entriesDataPromise = getEntriesByTopicId(topicId);

                const [topicResponse, entriesResponse] = await Promise.all([
                    topicDataPromise,
                    entriesDataPromise
                ]);
                
                setTopic(topicResponse.topic);
                setEntries(entriesResponse.entries); // <-- 3. Simpan data kosakata ke state
            } catch (error) {
                console.error("Gagal mengambil data untuk halaman kosakata.", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [topicId]);

    if (isLoading) {
        return <div className="text-center">Memuat...</div>;
    }

    if (!topic) {
        return <div className="text-center">Topik tidak ditemukan.</div>;
    }

    const pageTitle =
        topic.topicName.find(n => n.lang === i18n.language)?.value ||
        topic.topicName.find(n => n.lang === 'id')?.value ||
        "Detail Topik";

    return (
        <>
            <PageHeader title={pageTitle}>
                <div className='flex items-center gap-4'>
                    <Link to={`/quiz/${topicId}`} className="bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-lg text-sm hover:bg-blue-200">
                        {t('quizButton')}
                    </Link>
                    <Link to="/home" className="text-sm text-gray-600 hover:text-black">
                        &larr; {t('backButton')}
                    </Link>
                </div>
            </PageHeader>

            {/* 4. Gunakan state 'entries' untuk me-render kartu */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {entries.map((entry) => {
                    // Cari kosakata B.Indonesia dari setiap entri untuk ditampilkan
                    const vocabIndonesia = entry.entryVocabularies.find(
                        (v) => v.language.languageCode === 'id'
                    )?.vocab;

                    return (
                        <KosakataCard 
                            key={entry._id} 
                            content={vocabIndonesia || 'N/A'} 
                        />
                    );
                })}
            </div>
        </>
    );
};

export default KosakataPage;