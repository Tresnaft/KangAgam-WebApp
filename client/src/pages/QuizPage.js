import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import useAudioFeedback from '../hooks/useAudioFeedback';
import { getEntriesByTopicId } from '../services/entryService';
import { getTopicById } from '../services/topicService';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import PageHeader from '../components/ui/PageHeader';

// --- Komponen QuizFeedbackPopup ---
const CheckIcon = () => ( <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
const ExclamationIcon = () => ( <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );

const QuizFeedbackPopup = ({ isOpen, type }) => {
    const content = {
        correct: { icon: <CheckIcon />, text: "Hebat!", bgColor: "bg-green-100 dark:bg-green-900/50" },
        incorrect: { icon: <ExclamationIcon />, text: "Coba lagi, ya!", bgColor: "bg-yellow-100 dark:bg-yellow-900/50" },
    };
    const selectedContent = content[type] || content.correct;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className={`p-8 rounded-2xl flex flex-col items-center gap-4 ${selectedContent.bgColor}`}>
                        {selectedContent.icon}
                        <p className="text-2xl font-bold text-text">{selectedContent.text}</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// ... Helper functions and variants ...
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
const findVocab = (entry, lang) => entry?.entryVocabularies?.find(v => v.language.languageCode === lang) || entry?.entryVocabularies?.[0];
const modalContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
const modalItemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };


const QuizPage = () => {
    // ... state hooks ...
    const { topicId } = useParams();
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const { playCorrectSound, playIncorrectSound } = useAudioFeedback();
    const [topicName, setTopicName] = useState('');
    const [allEntries, setAllEntries] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    // ✅ 1. TAMBAHKAN KEMBALI STATE UNTUK ATTEMPTS PER PERTANYAAN
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [feedback, setFeedback] = useState({ show: false, correct: false, selectedId: null });
    const [quizState, setQuizState] = useState('loading');
    const [feedbackPopup, setFeedbackPopup] = useState({ isOpen: false, type: null });
    const [isAnswering, setIsAnswering] = useState(false);

    // ... useEffects for fetching data and setting up questions (no changes here) ...
    const playQuestionAudio = useCallback((audioUrl) => {
        if (!audioUrl) return;
        if (audioRef.current) audioRef.current.pause();
        const audio = new Audio(`http://localhost:5000${audioUrl}`);
        audioRef.current = audio;
        audio.play().catch(e => e.name !== 'AbortError' && console.error(e));
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
        const wrongOptionsPool = allEntriesSource.filter(e => e._id !== currentQ._id);
        const shuffledWrongOptions = shuffleArray(wrongOptionsPool).slice(0, 3);
        setOptions(shuffleArray([currentQ, ...shuffledWrongOptions]));
        const audioUrl = findVocab(currentQ, i18n.language)?.audioUrl;
        playQuestionAudio(audioUrl);
    }, [questions, i18n.language, playQuestionAudio]);

    useEffect(() => {
        const initializeQuiz = async () => {
            try {
                const [topicData, entriesData] = await Promise.all([getTopicById(topicId), getEntriesByTopicId(topicId)]);
                const entries = entriesData.entries || [];
                if (entries.length < 4) {
                    setQuizState('not_enough_data');
                    return;
                }
                const mainTopicName = topicData.topic.topicName.find(t => t.lang === 'id')?.value || 'Kuis';
                setTopicName(mainTopicName);
                setAllEntries(entries);
                setQuestions(shuffleArray(entries).slice(0, 5));
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


    // --- LOGIKA UTAMA YANG DIPERBARUI ---
    const handleAnswerClick = async (selectedEntry) => {
        if (isAnswering) return;
        setIsAnswering(true);

        const isCorrect = selectedEntry._id === questions[currentQuestionIndex]._id;
        setFeedback({ show: true, correct: isCorrect, selectedId: selectedEntry._id });

        if (isCorrect) {
            setScore(s => s + 1);
            setFeedbackPopup({ isOpen: true, type: 'correct' });
            await playCorrectSound();
            handleNextQuestion();
        } else {
            // Logika untuk jawaban salah
            const newWrongAttempts = wrongAttempts + 1;
            setWrongAttempts(newWrongAttempts);
            
            setFeedbackPopup({ isOpen: true, type: 'incorrect' });
            await playIncorrectSound();
            
            if (newWrongAttempts >= 3) {
                // Jika sudah salah 3 kali, tambah skor salah dan lanjut
                setWrongCount(w => w + 1);
                handleNextQuestion();
            } else {
                // Jika belum 3 kali, sembunyikan popup dan biarkan user coba lagi
                setFeedbackPopup({ isOpen: false, type: null });
                setFeedback({ show: false, correct: false, selectedId: null });
            }
        }
        
        setIsAnswering(false);
    };

    const handleNextQuestion = () => {
        setFeedback({ show: false, correct: false, selectedId: null });
        setFeedbackPopup({ isOpen: false, type: null });
        // ✅ 2. RESET ATTEMPTS KETIKA PINDAH PERTANYAAN
        setWrongAttempts(0);
        if (currentQuestionIndex + 1 >= questions.length) {
            setQuizState('finished');
        } else {
            setCurrentQuestionIndex(i => i + 1);
        }
    };
    
    const restartQuiz = () => {
        setScore(0);
        setWrongCount(0);
        // ✅ 3. RESET ATTEMPTS KETIKA RESTART KUIS
        setWrongAttempts(0);
        setCurrentQuestionIndex(0);
        setQuestions(shuffleArray(allEntries).slice(0, 5));
        setQuizState('playing');
        setIsAnswering(false);
    };

    const currentQuestion = questions[currentQuestionIndex];
    const questionAudio = currentQuestion ? findVocab(currentQuestion, i18n.language)?.audioUrl : null;

    if (quizState === 'loading') return <div className="flex items-center justify-center h-screen"><LoadingIndicator /></div>;
    
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
            <div className="sticky top-0 z-10 bg-background border-b border-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-5">
                        <PageHeader title={`Kuis Topik ${topicName}`}>
                            <Link to={`/topik/${topicId}`} className="flex items-center justify-center gap-2 bg-background-secondary text-text-secondary font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 whitespace-nowrap">
                                <span>←</span>
                                <span>Kembali ke Topik</span>
                            </Link>
                        </PageHeader>
                    </div>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {quizState === 'playing' && currentQuestion && (
                    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                        <h3 className="text-2xl font-semibold text-text-secondary text-center">Dengarkan pertanyaan melalui audio ini</h3>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => playQuestionAudio(questionAudio)} className="my-6 w-32 h-32 bg-accent/20 text-accent rounded-2xl flex items-center justify-center text-5xl shadow-lg">🔊</motion.button>
                        <div className="flex justify-center items-center gap-4">
                            <p className="font-bold text-text">Nilai Kamu</p>
                            <div className="bg-secondary/20 text-secondary font-bold px-4 py-2 rounded-lg">Benar: {score}</div>
                            <div className="bg-red-500/10 text-red-500 font-bold px-4 py-2 rounded-lg">Salah: {wrongCount}</div>
                        </div>
                        <hr className="w-full my-8 border-background-secondary" />
                        <div className="w-full">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                                {options.map(opt => (
                                    <motion.div key={opt._id} onClick={() => handleAnswerClick(opt)} className={`relative aspect-square bg-background-secondary rounded-2xl overflow-hidden shadow-md cursor-pointer border-4 transition-all duration-300 ${feedback.show && feedback.selectedId === opt._id ? (feedback.correct ? 'border-secondary scale-105' : 'border-red-500') : 'border-transparent'}`}>
                                        <img src={`http://localhost:5000${opt.entryImagePath}`} className="w-full h-full object-cover" alt="Pilihan Jawaban" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {quizState === 'finished' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div variants={modalContainerVariants} initial="hidden" animate="visible" className="bg-background-secondary p-8 rounded-2xl text-center shadow-2xl w-full max-w-md">
                            <motion.h2 variants={modalItemVariants} className="text-3xl font-bold mb-4 text-text">Kuis Selesai!</motion.h2>
                            <motion.p variants={modalItemVariants} className="text-xl text-text-secondary">Skor Akhir Anda:</motion.p>
                            <motion.p variants={modalItemVariants} className="text-6xl font-bold my-4 text-primary">{score} / {questions.length}</motion.p>
                            <motion.div variants={modalItemVariants} className="flex flex-col sm:flex-row gap-4 mt-6">
                                <button onClick={restartQuiz} className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 font-bold">Coba Lagi</button>
                                <button onClick={() => navigate(`/topik/${topicId}`)} className="w-full bg-background text-text px-6 py-3 rounded-lg hover:bg-background/80 font-bold">Kembali ke Topik</button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <QuizFeedbackPopup isOpen={feedbackPopup.isOpen} type={feedbackPopup.type} />
        </motion.div>
    );
};

export default QuizPage;