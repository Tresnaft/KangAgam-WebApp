import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import KosakataCard from '../components/ui/KosakataCard';

// --- DATA SIMULASI ---
// Di aplikasi nyata, ini akan datang dari API backend
const MOCK_QUIZ_DATA = {
    'abjad': [
        { question: 'Suara untuk "Aa"', answer: 'Aa', options: ['Aa', 'Ii', 'Uu', 'Ee'] },
        { question: 'Suara untuk "Bb"', answer: 'Bb', options: ['Dd', 'Bb', 'Pp', 'Gg'] },
        { question: 'Suara untuk "Cc"', answer: 'Cc', options: ['Kk', 'Ss', 'Cc', 'Gg'] },
        { question: 'Suara untuk "Dd"', answer: 'Dd', options: ['Dd', 'Bb', 'Tt', 'Pp'] },
        { question: 'Suara untuk "Ee"', answer: 'Ee', options: ['Aa', 'Ii', 'Oo', 'Ee'] },
        { question: 'Suara untuk "Ff"', answer: 'Ff', options: ['Vv', 'Pp', 'Ff', 'Hh'] },
    ],
    'angka': [
        { question: 'Suara untuk "Satu"', answer: '1', options: ['1', '7', '2', '5'] },
        { question: 'Suara untuk "Dua"', answer: '2', options: ['3', '2', '8', '6'] },
        { question: 'Suara untuk "Tiga"', answer: '3', options: ['5', '9', '3', '1'] },
        { question: 'Suara untuk "Empat"', answer: '4', options: ['4', '6', '1', '8'] },
        { question: 'Suara untuk "Lima"', answer: '5', options: ['2', '5', '7', '3'] },
        { question: 'Suara untuk "Enam"', answer: '6', options: ['9', '4', '6', '8'] },
    ]
};
// --------------------

const QuizPage = () => {
    const { topicId } = useParams();
    const { t } = useTranslation();

    // State untuk mengelola jalannya kuis
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState({ benar: 0, salah: 0 });
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null); // Untuk feedback visual

    // Mengambil dan mengacak 5 pertanyaan saat halaman dimuat
    useEffect(() => {
        const allQuestions = MOCK_QUIZ_DATA[topicId] || [];
        if (allQuestions.length > 0) {
            const shuffled = allQuestions.sort(() => 0.5 - Math.random());
            setQuestions(shuffled.slice(0, 5));
        } else {
            setQuestions([]);
        }
    }, [topicId]);

    const currentQuestion = questions[currentQuestionIndex];

    // Fungsi untuk lanjut ke pertanyaan berikutnya atau menyelesaikan kuis
    const handleNextQuestion = () => {
        if (currentQuestionIndex >= questions.length - 1) {
            setShowPopup(true);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setWrongAttempts(0);
            setSelectedAnswer(null);
        }
    };

    // Fungsi yang dijalankan saat pengguna memilih jawaban
    const handleAnswerClick = (option) => {
        if (!currentQuestion || selectedAnswer) return; // Mencegah klik ganda

        setSelectedAnswer(option);

        if (option === currentQuestion.answer) {
            // Jawaban Benar
            setScore(prev => ({ ...prev, benar: prev.benar + 1 }));
            setTimeout(() => handleNextQuestion(), 1000); // Beri jeda 1 detik
        } else {
            // Jawaban Salah
            if (wrongAttempts < 2) {
                setWrongAttempts(prev => prev + 1);
                setTimeout(() => setSelectedAnswer(null), 1000); // Reset pilihan setelah 1 detik
            } else {
                setScore(prev => ({ ...prev, salah: prev.salah + 1 }));
                setTimeout(() => handleNextQuestion(), 1000); // Beri jeda 1 detik
            }
        }
    };

    // Tampilan loading jika data belum siap
    if (questions.length === 0) {
        return <div className="p-8">Mencari data kuis untuk topik '{topicId}'...</div>;
    }
    
    if (!currentQuestion) {
        return <div className="p-8">Memuat pertanyaan...</div>;
    }

    return (
        <>
            {/* Tombol Kembali */}
            <div className="w-full mb-6">
                <Link 
                    to={`/topik/${topicId}`} 
                    className="text-sm text-gray-600 hover:text-black font-medium flex items-center gap-2 w-fit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t('backButton')} ke Kosakata
                </Link>
            </div>

            {/* Header Halaman Kuis */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">
                    {t('quizButton')} Topik {t(`topics.${topicId}`)}
                </h1>
                <p className="text-lg text-gray-600 mt-2">Dengarkan Pertanyaan melalui audio ini</p>
            </div>

            {/* Konten Utama Kuis */}
            <div className="text-center">
                <div className="my-8 flex justify-center">
                    <div className="w-32 h-32 bg-yellow-200 rounded-2xl flex items-center justify-center text-5xl animate-pulse cursor-pointer">
                        🔊
                    </div>
                </div>

                <div className="flex justify-center items-center gap-6 mb-8">
                    <span className="text-lg font-bold">Nilai Kamu</span>
                    <span className="text-lg font-bold bg-green-200 text-green-800 px-4 py-1 rounded-lg">Benar: {score.benar}</span>
                    <span className="text-lg font-bold bg-red-200 text-red-800 px-4 py-1 rounded-lg">Salah: {wrongAttempts} / 3</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                    {currentQuestion.options.map((option, index) => (
                        <div key={index} onClick={() => handleAnswerClick(option)}>
                            <KosakataCard content={option} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Popup Hasil Akhir */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-10 rounded-xl text-center shadow-2xl animate-pulse">
                        <h2 className="text-3xl font-bold mb-4">Quiz Selesai!</h2>
                        <p className="text-xl">Skor Akhir Anda:</p>
                        <p className="text-5xl font-bold my-4">{score.benar} / {questions.length}</p>
                        <button onClick={() => window.location.reload()} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuizPage;
