import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const WordFormModal = ({ isOpen, onClose, onSubmit, mode, initialData }) => {
    const [entryImage, setEntryImage] = useState(null);
    const [vocabularies, setVocabularies] = useState([]);

    useEffect(() => {
        if (isOpen) {
            // --- PERBAIKAN UTAMA: Selalu gunakan urutan 'id', 'su', 'en' ---
            const languageOrder = ['id', 'su', 'en'];

            if (mode === 'edit' && initialData) {
                // Untuk mode edit, petakan data yang ada ke urutan yang benar
                const initialVocabs = languageOrder.map(langCode => {
                    const existing = initialData.entryVocabularies.find(v => v.language.languageCode === langCode);
                    return {
                        _id: existing?._id,
                        languageCode: langCode,
                        vocab: existing?.vocab || '',
                        audioFile: null
                    };
                });
                setVocabularies(initialVocabs);
                setEntryImage(null);
            } else {
                // Untuk mode tambah, buat state kosong dengan urutan yang benar
                setEntryImage(null);
                setVocabularies(
                    languageOrder.map(langCode => ({
                        languageCode: langCode,
                        vocab: '',
                        audioFile: null
                    }))
                );
            }
        }
    }, [isOpen, mode, initialData]);

    const handleVocabChange = (index, field, value) => {
        const newVocabs = [...vocabularies];
        newVocabs[index][field] = value;
        setVocabularies(newVocabs);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        if (mode === 'add' && !entryImage) {
            alert('Gambar utama untuk kosakata harus diisi.');
            return;
        }
        if (entryImage) {
            formData.append('entryImage', entryImage);
        }

        const filledVocabs = vocabularies.filter(v => v.vocab.trim() !== '');
        if (filledVocabs.length === 0) {
            alert('Minimal satu kosakata harus diisi.');
            return;
        }

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
                        className="bg-background-secondary rounded-2xl shadow-xl w-full max-w-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit}>
                            <header className="flex items-center justify-between p-6 border-b border-background">
                                <h2 className="text-xl font-bold text-text">
                                    {mode === 'edit' ? `Edit Kosakata` : 'Tambah Kosakata'}
                                </h2>
                                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-background"><CloseIcon /></button>
                            </header>

                            <main className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                                <div>
                                    <label htmlFor="entryImage" className="block text-sm font-medium text-text-secondary mb-1">Gambar Utama {mode === 'edit' && '(Opsional)'}</label>
                                    <input type="file" id="entryImage" name="entryImage" accept="image/*" onChange={(e) => setEntryImage(e.target.files[0])}
                                        className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" required={mode === 'add'} />
                                </div>
                                <hr className="border-background"/>
                                {vocabularies.map((voc, index) => (
                                    <div key={index} className="space-y-2 p-4 border border-background rounded-lg">
                                        <h3 className="font-semibold text-text">{languageNames[voc.languageCode]}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor={`vocab-${voc.languageCode}`} className="block text-sm font-medium text-text-secondary mb-1">Teks Kosakata</label>
                                                <input type="text" id={`vocab-${voc.languageCode}`} value={voc.vocab} onChange={(e) => handleVocabChange(index, 'vocab', e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-text" />
                                            </div>
                                            <div>
                                                <label htmlFor={`audio-${voc.languageCode}`} className="block text-sm font-medium text-text-secondary mb-1">File Audio {mode === 'edit' && '(Opsional)'}</label>
                                                <input type="file" id={`audio-${voc.languageCode}`} accept="audio/*" onChange={(e) => handleVocabChange(index, 'audioFile', e.target.files[0])}
                                                    className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-600 hover:file:bg-blue-500/20"/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </main>

                            <footer className="p-6 bg-background rounded-b-2xl">
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