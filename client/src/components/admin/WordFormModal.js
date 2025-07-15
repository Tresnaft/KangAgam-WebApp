import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const WordFormModal = ({ isOpen, onClose, onSubmit, mode, initialData }) => {
    const [formData, setFormData] = useState({
        indonesia: '', sunda: '', inggris: '', image: null, audio: null
    });

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({
                indonesia: initialData.indonesia || '',
                sunda: initialData.sunda || '',
                inggris: initialData.inggris || '',
                image: null, // Reset file inputs
                audio: null,
            });
        } else {
            setFormData({ indonesia: '', sunda: '', inggris: '', image: null, audio: null });
        }
    }, [isOpen, mode, initialData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit}>
                            <header className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {mode === 'edit' ? `Edit Kosakata / ${initialData?.indonesia}` : 'Tambah Kosakata'}
                                </h2>
                                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                                    <CloseIcon />
                                </button>
                            </header>

                            <main className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="indonesia" className="block text-sm font-medium text-gray-600 mb-1">Indonesia</label>
                                        <input type="text" id="indonesia" name="indonesia" value={formData.indonesia} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
                                    </div>
                                    <div>
                                        <label htmlFor="audio_id" className="block text-sm font-medium text-gray-600 mb-1">Audio (ID)</label>
                                        <input type="file" id="audio_id" name="audio_id" onChange={handleChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     <div>
                                        <label htmlFor="sunda" className="block text-sm font-medium text-gray-600 mb-1">Sunda</label>
                                        <input type="text" id="sunda" name="sunda" value={formData.sunda} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                                    </div>
                                    <div>
                                        <label htmlFor="audio_su" className="block text-sm font-medium text-gray-600 mb-1">Audio (SU)</label>
                                        <input type="file" id="audio_su" name="audio_su" onChange={handleChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="inggris" className="block text-sm font-medium text-gray-600 mb-1">Inggris</label>
                                        <input type="text" id="inggris" name="inggris" value={formData.inggris} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                                    </div>
                                     <div>
                                        <label htmlFor="audio_en" className="block text-sm font-medium text-gray-600 mb-1">Audio (EN)</label>
                                        <input type="file" id="audio_en" name="audio_en" onChange={handleChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-600 mb-1">Gambar</label>
                                    <input type="file" id="image" name="image" onChange={handleChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                                </div>
                            </main>

                            <footer className="p-6 bg-gray-50 rounded-b-2xl">
                                <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
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