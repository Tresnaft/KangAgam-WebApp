import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. Import hook `useTranslation`

import KosakataCard from '../components/ui/KosakataCard';
import PageHeader from '../components/ui/PageHeader';

// DATA SIMULASI (tidak berubah)
const MOCK_DATA = {
    'abjad': ['Aa', 'Bb', 'Cc', 'Dd', 'Ee', 'Ff', 'Gg', 'Hh', 'Ii', 'Jj', 'Kk', 'Ll', 'Mm', 'Nn', 'Oo', 'Pp', 'Qq', 'Rr', 'Ss', 'Tt', 'Uu', 'Vv', 'Ww', 'Xx', 'Yy', 'Zz'],
    'angka': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    'buah': ['Apel', 'Jeruk', 'Mangga', 'Pisang', 'Anggur'],
};

const KosakataPage = () => {
    const { topicId } = useParams(); 
    const { t } = useTranslation(); // 2. Panggil hook `useTranslation`

    const items = MOCK_DATA[topicId] || [];
    
    // 3. Ganti cara membuat judul. Sekarang kita ambil dari file terjemahan.
    // `topicId` dari URL (contoh: "abjad") cocok dengan kunci di JSON kita.
    const pageTitle = t(`topics.${topicId}`);

    return (
        <>
            <PageHeader title={pageTitle}>
                <div className='flex items-center gap-4'>
                    {/* 4. Ganti teks tombol dengan fungsi t() */}
                    <Link to={`/quiz/${topicId}`} className="bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-lg text-sm hover:bg-blue-200">
                        {t('quizButton')}
                    </Link>
                    <Link to="/home" className="text-sm text-gray-600 hover:text-black">
                        &larr; {t('backButton')}
                    </Link>
                </div>
            </PageHeader>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {items.map((item, index) => (
                    <KosakataCard key={index} content={item} />
                ))}
            </div>
        </>
    );
};

export default KosakataPage;