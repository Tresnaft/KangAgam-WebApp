import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);


const WordFormModal = ({ isOpen, onClose, onSubmit, mode, initialData }) => {
    const [entryImage, setEntryImage] = useState(null);
    const [vocabularies, setVocabularies] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const audioPlayer = useRef(null);
    // ✅ 1. Tambahkan state errors
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            const languageOrder = ['id', 'su', 'en'];

            if (mode === 'edit' && initialData) {
                const initialVocabs = languageOrder.map(langCode => {
                    const existing = initialData.entryVocabularies.find(v => v.language.languageCode === langCode);
                    return {
                        _id: existing?._id,
                        languageCode: langCode,
                        vocab: existing?.vocab || '',
                        audioFile: null,
                        existingAudioUrl: existing?.audioUrl || null,
                    };
                });
                setVocabularies(initialVocabs);
                setEntryImage(null);
                if (initialData.entryImagePath) {
                    setImagePreview(`http://localhost:5000${initialData.entryImagePath}`);
                }
            } else {
                setEntryImage(null);
                setImagePreview(null);
                setVocabularies(
                    languageOrder.map(langCode => ({
                        languageCode: langCode,
                        vocab: '',
                        audioFile: null,
                        existingAudioUrl: null,
                    }))
                );
            }
            // Reset errors saat modal dibuka
            setErrors({});
        } else {
            if (audioPlayer.current) {
                audioPlayer.current.pause();
                audioPlayer.current = null;
            }
        }
    }, [isOpen, mode, initialData]);

    const handleVocabChange = (index, field, value) => {
        const newVocabs = [...vocabularies];
        newVocabs[index][field] = value;
        setVocabularies(newVocabs);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEntryImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handlePlayAudio = (audioUrl) => {
        if (audioPlayer.current) {
            audioPlayer.current.pause();
        }
        const newAudio = new Audio(`http://localhost:5000${audioUrl}`);
        audioPlayer.current = newAudio;
        newAudio.play();
    };

    // ✅ 2. Buat fungsi validasi
    const validateForm = () => {
        const newErrors = {};
        if (mode === 'add' && !entryImage) {
            newErrors.entryImage = 'Gambar utama wajib diunggah.';
        }
        const filledVocabs = vocabularies.filter(v => v.vocab.trim() !== '');
        if (filledVocabs.length === 0) {
            newErrors.vocabularies = 'Minimal satu kosakata harus diisi.';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        
        setErrors({});
        const formData = new FormData();
        
        if (entryImage) {
            formData.append('entryImage', entryImage);
        }

        const filledVocabs = vocabularies.filter(v => v.vocab.trim() !== '');
        const audioFiles = [];
        let audioIndexCounter = 0;
        const entryData = {
            entryVocabularies: filledVocabs.map(v => {
                const vocabPayload = {
                    _id: v._id,
                    languageCode: v.languageCode,
                    vocab: v.vocab
                };
                if (v.audioFile) {
                    audioFiles.push(v.audioFile);
                    vocabPayload.newAudioIndex = audioIndexCounter++;
                }
                return vocabPayload;
            })
        };
        
        formData.append('entryData', JSON.stringify(entryData));
        audioFiles.forEach(file => formData.append('audioFiles', file));

        onSubmit(formData);
    };

    const languageNames = { id: 'Indonesia', su: 'Sunda', en: 'Inggris' };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-background-secondary rounded-2xl shadow-xl w-full max-w-lg flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit}>
                            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-background">
                                <h2 className="text-xl font-bold text-text">{mode === 'edit' ? `Edit Kosakata` : 'Tambah Kosakata'}</h2>
                                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-background"><CloseIcon /></button>
                            </header>

                            <main className="p-4 space-y-3 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label htmlFor="entryImage" className="block text-sm font-medium text-text-secondary mb-1">Gambar Utama {mode === 'edit' && '(Opsional)'}</label>
                                    {imagePreview && (
                                        <div className="mt-2 mb-3">
                                            <img src={imagePreview} alt="Pratinjau" className="w-24 h-24 object-cover rounded-lg" />
                                        </div>
                                    )}
                                    <input type="file" id="entryImage" name="entryImage" accept="image/*" onChange={handleImageChange}
                                        className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                                    {/* ✅ 3. Tampilkan pesan error untuk gambar */}
                                    {errors.entryImage && <p className="text-red-500 text-xs mt-1">{errors.entryImage}</p>}
                                </div>
                                <hr className="border-background"/>
                                {/* ✅ 3. Tampilkan pesan error umum untuk kosakata */}
                                {errors.vocabularies && <p className="text-red-500 text-sm mb-2">{errors.vocabularies}</p>}
                                {vocabularies.map((voc, index) => (
                                    <div key={index} className="space-y-2 p-3 border border-background rounded-lg">
                                        <h3 className="font-semibold text-text">{languageNames[voc.languageCode]}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor={`vocab-${voc.languageCode}`} className="block text-sm font-medium text-text-secondary mb-1">Teks Kosakata</label>
                                                <input type="text" id={`vocab-${voc.languageCode}`} value={voc.vocab} onChange={(e) => handleVocabChange(index, 'vocab', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-text" />
                                            </div>
                                            <div>
                                                <label htmlFor={`audio-${voc.languageCode}`} className="block text-sm font-medium text-text-secondary mb-1">File Audio {mode === 'edit' && '(Opsional)'}</label>
                                                {mode === 'edit' && voc.existingAudioUrl && !voc.audioFile && (
                                                    <div className="flex items-center justify-between text-xs text-text-secondary mt-1 mb-2 p-2 bg-background rounded-md">
                                                        <span className="truncate pr-2">File: {voc.existingAudioUrl.split('/').pop()}</span>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handlePlayAudio(voc.existingAudioUrl)}
                                                            className="p-1 rounded-full text-primary hover:bg-primary/10"
                                                        >
                                                            <PlayIcon />
                                                        </button>
                                                    </div>
                                                )}
                                                <input type="file" id={`audio-${voc.languageCode}`} accept="audio/*" onChange={(e) => handleVocabChange(index, 'audioFile', e.target.files[0])}
                                                    className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-600 hover:file:bg-blue-500/20"/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </main>

                            <footer className="flex-shrink-0 p-4 bg-background rounded-b-2xl">
                                <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90">
                                    {mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Kosakata'}
                                </button>
                            </footer>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WordFormModal;