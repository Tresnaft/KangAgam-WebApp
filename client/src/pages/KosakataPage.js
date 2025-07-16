import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import KosakataCard from '../components/ui/KosakataCard';
import PageHeader from '../components/ui/PageHeader';
import LoadingIndicator from '../components/ui/LoadingIndicator';

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

// Path aset diperbarui dengan nama folder yang sudah diubah (tanpa spasi)
const MOCK_DATA = {
    'abjad': [
        { id: 'a', text: { id: 'A', en: 'A', su: 'A' }, image: '/assets/images/kosakata/abjad/abjad-a.png', audio: { id: '/assets/voice_over_kang_agam/voice_over_kang_agam_ID/abjad/A-i.mp3', en: '#', su: '#' } },
        { id: 'b', text: { id: 'B', en: 'B', su: 'B' }, image: '/assets/images/kosakata/abjad/abjad-b.png', audio: { id: '/assets/voice_over_kang_agam/voice_over_kang_agam_ID/abjad/B-i.mp3', en: '#', su: '#' } },
        { id: 'c', text: { id: 'C', en: 'C', su: 'C' }, image: '/assets/images/kosakata/abjad/abjad-c.png', audio: { id: '/assets/voice_over_kang_agam/voice_over_kang_agam_ID/abjad/C-i.mp3', en: '#', su: '#' } },
    ],
    'angka': [
        { id: 'satu', text: { id: '1', en: 'One', su: 'Hiji' }, image: '/assets/images/kosakata/angka/angka-1.png', audio: { id: '/assets/voice_over_kang_agam/voice_over_kang_agam_ID/angka/1-i.mp3', en: '#', su: '#' } },
        { id: 'dua', text: { id: '2', en: 'Two', su: 'Dua' }, image: '/assets/images/kosakata/angka/angka-2.png', audio: { id: '/assets/voice_over_kang_agam/voice_over_kang_agam_ID/angka/2-i.mp3', en: '#', su: '#' } },
    ],
};

const KosakataPage = () => {
    const { topicId } = useParams();
    const { t, i18n } = useTranslation();

    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeEntry, setActiveEntry] = useState(null);

    useEffect(() => {
        const startTime = Date.now();
        const data = MOCK_DATA[topicId] || [];
        setEntries(data);
        if (data.length > 0) {
            setActiveEntry(data[0]);
        }

        const elapsedTime = Date.now() - startTime;
        const minDuration = 400;
        setTimeout(() => {
            setIsLoading(false);
        }, Math.max(0, minDuration - elapsedTime));
    }, [topicId]);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    const pageTitle = t(`topics.${topicId}`);

    return (
        // FIX: Menambahkan padding atas (pt-4) untuk memberi jarak dari navbar
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="p-4 sm:p-6 lg:p-8 pt-4"
        >
            <div className="max-w-7xl mx-auto">
                <PageHeader title={pageTitle}>
                    <div className='flex items-center gap-4'>
                        <Link to={`/quiz/${topicId}`} className="bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-lg text-sm hover:bg-blue-200">{t('quizButton')}</Link>
                        <Link to="/home" className="text-sm text-gray-600 hover:text-black">&larr; {t('backButton')}</Link>
                    </div>
                </PageHeader>
            
                <div className="lg:flex lg:gap-8">
                    <div className="w-full lg:w-1/3">
                        <div className="lg:sticky top-24">
                            <div className="bg-gray-100 rounded-2xl shadow-inner overflow-hidden">
                                <div className="aspect-w-1 aspect-h-1">
                                    {activeEntry ? (
                                        <img src={activeEntry.image} alt="Gambar kosakata" className="w-full h-full object-contain p-4" />
                                    ) : (
                                        <div className="flex items-center justify-center text-gray-400">Pilih kosakata</div>
                                    )}
                                </div>
                            </div>
                            {activeEntry && (
                                <div className="mt-4 text-center bg-white p-4 rounded-2xl shadow-md">
                                    <p className="text-2xl font-bold text-gray-800">{activeEntry.text.id}</p>
                                    <p className="text-lg text-gray-600">{activeEntry.text.su}</p>
                                    <p className="text-lg text-gray-500 italic">{activeEntry.text.en}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-2/3 mt-8 lg:mt-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {entries.map((entry) => {
                                const currentLang = i18n.language;
                                const vocabText = entry.text[currentLang] || entry.text.id;
                                const audioUrl = entry.audio[currentLang] || entry.audio.id;

                                return (
                                    <KosakataCard 
                                        key={entry.id} 
                                        content={vocabText}
                                        imageUrl={entry.image}
                                        audioUrl={audioUrl}
                                        isActive={activeEntry && activeEntry.id === entry.id}
                                        onCardClick={() => setActiveEntry(entry)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default KosakataPage;