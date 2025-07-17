import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

const AudioPlayerModal = ({ entry, onClose }) => {
    if (!entry) return null;

    const playAudio = (audioUrl) => {
        if (!audioUrl || audioUrl.endsWith('#')) {
            alert('Audio untuk bahasa ini tidak tersedia.');
            return;
        }
        const audio = new Audio(audioUrl);
        audio.play().catch(err => console.error("Gagal memutar audio:", err));
    };

    const languageNames = { id: 'Indonesia', su: 'Sunda', en: 'Inggris' };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    <header className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-bold text-gray-800">Putar Audio</h3>
                        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><CloseIcon /></button>
                    </header>
                    <div className="p-4 space-y-2">
                        {entry.entryVocabularies.map(vocab => (
                            <button 
                                key={vocab._id}
                                onClick={() => playAudio(`http://localhost:5000${vocab.audioUrl}`)}
                                className="w-full flex items-center text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <PlayIcon />
                                <span>{languageNames[vocab.language.languageCode] || vocab.language.languageCode}</span>
                                <span className="ml-auto text-sm text-gray-500">{vocab.vocab}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AudioPlayerModal;