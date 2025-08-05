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

// Struktur data untuk satu section kosakata baru
const createNewEntrySection = () => ({
    id: Date.now() + Math.random(),
    entryImage: null,
    imagePreview: null,
    vocabularies: [
        { languageCode: 'id', vocab: '', audioFile: null },
        { languageCode: 'su', vocab: '', audioFile: null },
        { languageCode: 'en', vocab: '', audioFile: null },
    ],
    errors: {},
});

const WordFormModal = ({ isOpen, onClose, onSubmit, mode, initialData }) => {
    // State utama sekarang adalah array of entries
    const [entries, setEntries] = useState([createNewEntrySection()]);
    const audioPlayer = useRef(null);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                const languageOrder = ['id', 'su', 'en'];
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
                setEntries([{
                    id: initialData._id,
                    entryImage: null,
                    imagePreview: initialData.entryImagePath ? `http://localhost:5000${initialData.entryImagePath}` : null,
                    vocabularies: initialVocabs,
                    errors: {},
                }]);
            } else {
                setEntries([createNewEntrySection()]);
            }
        } else {
            if (audioPlayer.current) {
                audioPlayer.current.pause();
                audioPlayer.current = null;
            }
            // Membersihkan preview URL untuk mencegah memory leak
            entries.forEach(entry => {
                if (entry.imagePreview && entry.imagePreview.startsWith('blob:')) {
                    URL.revokeObjectURL(entry.imagePreview);
                }
            });
        }
    }, [isOpen, mode, initialData]);

    const handleAddEntrySection = () => {
        setEntries(prev => [...prev, createNewEntrySection()]);
    };

    const handleRemoveEntrySection = (entryId) => {
        setEntries(prev => prev.filter(entry => entry.id !== entryId));
    };

    const handleVocabChange = (entryId, vocabIndex, field, value) => {
        setEntries(prevEntries =>
            prevEntries.map(entry => {
                if (entry.id === entryId) {
                    const newVocabs = [...entry.vocabularies];
                    newVocabs[vocabIndex] = { ...newVocabs[vocabIndex], [field]: value };
                    return { ...entry, vocabularies: newVocabs };
                }
                return entry;
            })
        );
    };

    const handleImageChange = (entryId, e) => {
        const file = e.target.files[0];
        if (file) {
            setEntries(prevEntries =>
                prevEntries.map(entry => {
                    if (entry.id === entryId) {
                        const newErrors = { ...entry.errors };
                        delete newErrors.entryImage;
                        if (entry.imagePreview && entry.imagePreview.startsWith('blob:')) {
                            URL.revokeObjectURL(entry.imagePreview);
                        }
                        return { ...entry, entryImage: file, imagePreview: URL.createObjectURL(file), errors: newErrors };
                    }
                    return entry;
                })
            );
        }
    };

    const handlePlayAudio = (audioUrl) => {
        if (audioPlayer.current) audioPlayer.current.pause();
        const newAudio = new Audio(`http://localhost:5000${audioUrl}`);
        audioPlayer.current = newAudio;
        newAudio.play();
    };

    const validateAllEntries = () => {
        let allIsValid = true;
        const validatedEntries = entries.map(entry => {
            const newErrors = {};
            if (mode === 'add' && !entry.entryImage) {
                newErrors.entryImage = 'Gambar utama wajib diunggah.';
                allIsValid = false;
            }
            const filledVocabs = entry.vocabularies.filter(v => v.vocab.trim() !== '');
            if (filledVocabs.length === 0) {
                newErrors.vocabularies = 'Minimal satu kosakata harus diisi.';
                allIsValid = false;
            }
            return { ...entry, errors: newErrors };
        });
        setEntries(validatedEntries);
        return allIsValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateAllEntries()) return;

        const allFormData = entries.map(entry => {
            const formData = new FormData();
            if (entry.entryImage) {
                formData.append('entryImage', entry.entryImage);
            }

            const filledVocabs = entry.vocabularies.filter(v => v.vocab.trim() !== '' || v.audioFile);
            const audioFiles = [];
            let audioIndexCounter = 0;
            const entryData = {
                entryVocabularies: filledVocabs.map(v => {
                    const vocabPayload = { _id: v._id, languageCode: v.languageCode, vocab: v.vocab };
                    if (v.audioFile) {
                        audioFiles.push(v.audioFile);
                        vocabPayload.newAudioIndex = audioIndexCounter++;
                    }
                    return vocabPayload;
                })
            };
            
            formData.append('entryData', JSON.stringify(entryData));
            audioFiles.forEach(file => formData.append('audioFiles', file));

            // Jika mode edit, sertakan ID entri
            if (mode === 'edit') {
                formData.append('entryId', entry.id);
            }

            return formData;
        });

        onSubmit(allFormData);
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
                        className="bg-background-secondary rounded-2xl shadow-xl w-full max-w-3xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit}>
                            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-background">
                                <h2 className="text-xl font-bold text-text">{mode === 'edit' ? 'Edit Kosakata' : 'Tambah Kosakata'}</h2>
                                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-background"><CloseIcon /></button>
                            </header>

                            <main className="p-4 space-y-6 max-h-[75vh] overflow-y-auto">
                                {entries.map((entry, index) => (
                                    <div key={entry.id} className="p-4 bg-background rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 relative">
                                        {entries.length > 1 && mode === 'add' && (
                                            <button type="button" onClick={() => handleRemoveEntrySection(entry.id)}
                                                className="absolute -top-3 -right-3 p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                            </button>
                                        )}
                                        <p className="font-bold text-text">Kosakata #{index + 1}</p>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-1">Gambar Utama {mode === 'edit' && '(Opsional)'}</label>
                                            {entry.imagePreview && <div className="mt-2 mb-3"><img src={entry.imagePreview} alt="Pratinjau" className="w-24 h-24 object-cover rounded-lg" /></div>}
                                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(entry.id, e)} className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                                            {entry.errors.entryImage && <p className="text-red-500 text-xs mt-1">{entry.errors.entryImage}</p>}
                                        </div>
                                        <hr className="border-background"/>
                                        <div>
                                            {entry.errors.vocabularies && <p className="text-red-500 text-sm mb-2">{entry.errors.vocabularies}</p>}
                                            {entry.vocabularies.map((voc, vocIndex) => (
                                                <div key={voc.languageCode} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3 p-3 border border-background rounded-lg">
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-secondary mb-1">Teks Kosakata ({languageNames[voc.languageCode]})</label>
                                                        <input type="text" value={voc.vocab} onChange={(e) => handleVocabChange(entry.id, vocIndex, 'vocab', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-text" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-secondary mb-1">File Audio {mode === 'edit' && '(Opsional)'}</label>
                                                        {mode === 'edit' && voc.existingAudioUrl && !voc.audioFile && (
                                                            <div className="flex items-center justify-between text-xs text-text-secondary mt-1 mb-2 p-2 bg-background-secondary rounded-md">
                                                                <span className="truncate pr-2">File: {voc.existingAudioUrl.split('/').pop()}</span>
                                                                <button type="button" onClick={() => handlePlayAudio(voc.existingAudioUrl)} className="p-1 rounded-full text-primary hover:bg-primary/10"><PlayIcon /></button>
                                                            </div>
                                                        )}
                                                        <input type="file" accept="audio/*" onChange={(e) => handleVocabChange(entry.id, vocIndex, 'audioFile', e.target.files[0])} className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-600 hover:file:bg-blue-500/20"/>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {mode === 'add' && (
                                    <button
                                        type="button"
                                        onClick={handleAddEntrySection}
                                        className="w-full mt-4 px-4 py-2 border-2 border-dashed border-primary/50 text-primary text-sm font-semibold rounded-lg hover:bg-primary/10">
                                        + Tambah Section Kosakata Baru
                                    </button>
                                )}
                            </main>

                            <footer className="flex-shrink-0 p-4 bg-background rounded-b-2xl border-t border-background">
                                <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90">
                                    {mode === 'edit' ? 'Simpan Perubahan' : `Tambah ${entries.length} Kosakata`}
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