import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TopicCard from '../components/ui/TopicCard';
import PageHeader from '../components/ui/PageHeader';

const topicKeys = ['abjad', 'angka', 'buah', 'binatang', 'anggotaTubuh', 'warna', 'bentuk', 'profesi', 'sayuran', 'kuliner'];

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleTopicClick = (topicKey) => {
        // Hapus .toLowerCase() agar kuncinya tetap 'anggotaTubuh'
        const topicSlug = topicKey.replace(/ /g, '-');
        navigate(`/topik/${topicSlug}`);
    };

    return (
        <>
            {/* PageHeader sekarang hanya berisi judul, dropdown sudah pindah ke Navbar */}
            <PageHeader title={t('welcomeMessage')} />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {topicKeys.map((key) => (
                    <TopicCard 
                        key={key}
                        title={t(`topics.${key}`)}
                        imageUrl={null}
                        onClick={() => handleTopicClick(key)}
                    />
                ))}
            </div>
        </>
    );
};

export default HomePage;