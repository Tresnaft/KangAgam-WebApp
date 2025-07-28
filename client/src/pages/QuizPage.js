import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { getEntriesByTopicId } from '../services/entryService';
import { getTopicById } from '../services/topicService';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import PageHeader from '../components/ui/PageHeader';

// Helper functions and variants remain the same...
const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
};

const findVocab = (entry, lang) => {
    if (!entry || !entry.entryVocabularies) return null;
    return entry.entryVocabularies.find(v => v.language.languageCode === lang) || entry.entryVocabularies[0];
};

const modalContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const modalItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};


const QuizPage = () => {
    const { topicId } = useParams();
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const audioRef = useRef(null);

    const [topicName, setTopicName] = useState('');
    const [allEntries, setAllEntries] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [totalWrong, setTotalWrong] = useState(0);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [feedback, setFeedback] = useState({ show: false, correct: false, selectedId: null });
    const [quizState, setQuizState] = useState('loading');

    // All the logic functions (playQuestionAudio, setupQuestion, initializeQuiz, handleAnswerClick, etc.) remain the same.
    const playQuestionAudio = useCallback((audioUrl) => {
        if (!audioUrl) return;
        if (audioRef.current) {
            audioRef.current.pause();
        }
        const audio = new Audio(`http://localhost:5000${audioUrl}`);
        audioRef.current = audio;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                if (error.name !== 'AbortError') {
                    console.error("Error saat memutar audio:", error);
                }
            });
        }
    }, []);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const setupQuestion = useCallback((questionIndex, allEntriesSource) => {
        if (!questions[questionIndex]) return;
        const currentQ = questions[questionIndex];
        const correctAnswer = currentQ;
        
        const wrongOptionsPool = allEntriesSource.filter(e => e._id !== correctAnswer._id);
        const shuffledWrongOptions = shuffleArray(wrongOptionsPool).slice(0, 3);
        
        const finalOptions = shuffleArray([correctAnswer, ...shuffledWrongOptions]);
        setOptions(finalOptions);

        const audioUrl = findVocab(currentQ, i18n.language)?.audioUrl;
        playQuestionAudio(audioUrl);

    }, [questions, i18n.language, playQuestionAudio]);

    useEffect(() => {
        const initializeQuiz = async () => {
            try {
                const [topicData, entriesData] = await Promise.all([
                    getTopicById(topicId),
                    getEntriesByTopicId(topicId)
                ]);

                const entries = entriesData.entries || [];
                if (entries.length < 4) {
                    setQuizState('not_enough_data');
                    return;
                }
                
                const mainTopicName = topicData.topic.topicName.find(t => t.lang === 'id')?.value || 'Kuis';
                setTopicName(mainTopicName);

                setAllEntries(entries);
                const shuffledQuestions = shuffleArray(entries).slice(0, 5);
                setQuestions(shuffledQuestions);
                setQuizState('playing');
            } catch (error) {
                console.error("Gagal memuat kuis:", error);
                setQuizState('error');
            }
        };
        initializeQuiz();
    }, [topicId]);

    useEffect(() => {
        if (quizState === 'playing' && questions.length > 0) {
            setupQuestion(currentQuestionIndex, allEntries);
        }
    }, [currentQuestionIndex, questions, quizState, setupQuestion, allEntries]);

    const handleAnswerClick = (selectedEntry) => {
        if (feedback.show) return;

        const isCorrect = selectedEntry._id === questions[currentQuestionIndex]._id;
        setFeedback({ show: true, correct: isCorrect, selectedId: selectedEntry._id });

        if (isCorrect) {
            setScore(s => s + 1);
            setTimeout(() => handleNextQuestion(), 1200);
        } else {
            if (wrongAttempts + 1 >= 3) {
                setTotalWrong(w => w + 1);
                setTimeout(() => handleNextQuestion(), 1200);
            } else {
                setWrongAttempts(w => w + 1);
                setTimeout(() => setFeedback({ show: false, correct: false, selectedId: null }), 1200);
            }
        }
    };

    const handleNextQuestion = () => {
        setFeedback({ show: false, correct: false, selectedId: null });
        setWrongAttempts(0);
        if (currentQuestionIndex + 1 >= questions.length) {
            setQuizState('finished');
        } else {
            setCurrentQuestionIndex(i => i + 1);
        }
    };
    
    const restartQuiz = () => {
        setScore(0);
        setWrongAttempts(0);
        setTotalWrong(0);
        setCurrentQuestionIndex(0);
        const shuffledQuestions = shuffleArray(allEntries).slice(0, 5);
        setQuestions(shuffledQuestions);
        setQuizState('playing');
    };

    const currentQuestion = questions[currentQuestionIndex];
    const questionAudio = currentQuestion ? findVocab(currentQuestion, i18n.language)?.audioUrl : null;

    if (quizState === 'loading') return <div className="flex items-center justify-center h-screen"><LoadingIndicator /></div>;
    // ... (Error and not_enough_data states remain the same) ...

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
            {/* ✅ PERUBAHAN: Header menggunakan warna tema */}
            <div className="sticky top-0 z-10 bg-background border-b border-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-5">
                        <PageHeader title={`Kuis Topik ${topicName}`}>
                            {/* ✅ PERUBAHAN: Tombol dan link menggunakan warna tema */}
                            <Link to={`/topik/${topicId}`} className="text-sm text-text-secondary hover:text-text">&larr; Kembali ke Topik</Link>
                        </PageHeader>
                    </div>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {quizState === 'playing' && currentQuestion && (
                    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                        
                        {/* ✅ PERUBAHAN: Teks menggunakan warna tema */}
                        <h3 className="text-2xl font-semibold text-text-secondary text-center">Dengarkan Pertanyaan melalui audio ini</h3>
                        
                        {/* ✅ PERUBAHAN: Tombol audio menggunakan warna tema (accent) */}
                        <motion.button 
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => playQuestionAudio(questionAudio)}
                            className="my-6 w-32 h-32 bg-accent/20 text-accent rounded-2xl flex items-center justify-center text-5xl shadow-lg"
                        >
                            🔊
                        </motion.button>
                        
                        <div className="flex justify-center items-center gap-4">
                                {/* ✅ PERUBAHAN: Teks dan badge skor menggunakan warna tema */}
                                <p className="font-bold text-text">Nilai Kamu</p>
                                <div className="bg-secondary/20 text-secondary font-bold px-4 py-2 rounded-lg">
                                    Benar: {score}
                                </div>
                                <div className="bg-red-500/10 text-red-500 font-bold px-4 py-2 rounded-lg">
                                    Salah: {totalWrong}
                                </div>
                        </div>

                        {/* ✅ PERUBAHAN: Garis pemisah menggunakan warna tema */}
                        <hr className="w-full my-8 border-background-secondary" />

                        <div className="w-full">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                                {options.map(opt => (
                                    <motion.div 
                                        key={opt._id}
                                        onClick={() => handleAnswerClick(opt)}
                                        // ✅ PERUBAHAN: Kartu pilihan jawaban menggunakan warna tema
                                        className={`relative aspect-square bg-background-secondary rounded-2xl overflow-hidden shadow-md cursor-pointer border-4 transition-all duration-300 
                                                ${feedback.show && feedback.selectedId === opt._id 
                                                    ? (feedback.correct ? 'border-secondary scale-105' : 'border-red-500')
                                                    : 'border-transparent'
                                                }`}
                                    >
                                        <img 
                                            src={`http://localhost:5000${opt.entryImagePath}`} 
                                            className="w-full h-full object-cover"
                                            alt="Pilihan Jawaban"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {quizState === 'finished' && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* ✅ PERUBAHAN: Modal hasil kuis menggunakan warna tema */}
                        <motion.div 
                            variants={modalContainerVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-background-secondary p-8 rounded-2xl text-center shadow-2xl w-full max-w-md"
                        >
                            <motion.h2 variants={modalItemVariants} className="text-3xl font-bold mb-4 text-text">Kuis Selesai!</motion.h2>
                            <motion.p variants={modalItemVariants} className="text-xl text-text-secondary">Skor Akhir Anda:</motion.p>
                            <motion.p variants={modalItemVariants} className="text-6xl font-bold my-4 text-primary">{score} / {questions.length}</motion.p>
                            <motion.div variants={modalItemVariants} className="flex flex-col sm:flex-row gap-4 mt-6">
                                <button onClick={restartQuiz} className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 font-bold">
                                    Coba Lagi
                                </button>
                                <button onClick={() => navigate(`/topik/${topicId}`)} className="w-full bg-background text-text px-6 py-3 rounded-lg hover:bg-background/80 font-bold">
                                    Kembali ke Topik
                                </button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default QuizPage;