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
            if (mode === 'edit' && initialData) {
                // Pre-fill form for editing
                const initialVocabs = ['id', 'su', 'en'].map(langCode => {
                    const existing = initialData.entryVocabularies.find(v => v.language.languageCode === langCode);
                    return {
                        _id: existing?._id, // Keep track of existing vocab ID
                        languageCode: langCode,
                        vocab: existing?.vocab || '',
                        audioFile: null // Reset file input
                    };
                });
                setVocabularies(initialVocabs);
                setEntryImage(null); // Reset file input
            } else {
                // Reset form for adding
                setEntryImage(null);
                setVocabularies([
                    { languageCode: 'id', vocab: '', audioFile: null },
                    { languageCode: 'su', vocab: '', audioFile: null },
                    { languageCode: 'en', vocab: '', audioFile: null },
                ]);
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
                    _id: v._id, // Send existing ID if available
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
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit}>
                            <header className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {mode === 'edit' ? `Edit Kosakata` : 'Tambah Kosakata'}
                                </h2>
                                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><CloseIcon /></button>
                            </header>

                            <main className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                                <div>
                                    <label htmlFor="entryImage" className="block text-sm font-medium text-gray-600 mb-1">Gambar Utama {mode === 'edit' && '(Opsional)'}</label>
                                    <input type="file" id="entryImage" name="entryImage" accept="image/*" onChange={(e) => setEntryImage(e.target.files[0])}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" required={mode === 'add'} />
                                </div>
                                <hr/>
                                {vocabularies.map((voc, index) => (
                                    <div key={index} className="space-y-2 p-4 border rounded-lg">
                                        <h3 className="font-semibold text-gray-700">{languageNames[voc.languageCode]}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor={`vocab-${voc.languageCode}`} className="block text-sm font-medium text-gray-600 mb-1">Teks Kosakata</label>
                                                <input type="text" id={`vocab-${voc.languageCode}`} value={voc.vocab} onChange={(e) => handleVocabChange(index, 'vocab', e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                                            </div>
                                            <div>
                                                <label htmlFor={`audio-${voc.languageCode}`} className="block text-sm font-medium text-gray-600 mb-1">File Audio {mode === 'edit' && '(Opsional)'}</label>
                                                <input type="file" id={`audio-${voc.languageCode}`} accept="audio/*" onChange={(e) => handleVocabChange(index, 'audioFile', e.target.files[0])}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </main>

                            <footer className="p-6 bg-gray-50 rounded-b-2xl">
                                <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600">
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