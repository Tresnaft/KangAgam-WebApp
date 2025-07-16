import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const TopicFormModal = ({ isOpen, onClose, onSubmit, mode, initialData }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('Published');
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setName(initialData.topicName || '');
                setStatus(initialData.status || 'Published');
            } else {
                setName('');
                setStatus('Published');
                setImageFile(null);
            }
        }
    }, [isOpen, mode, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'add' && !imageFile) {
            alert('Silakan pilih gambar untuk topik.');
            return;
        }
        
        const formData = new FormData();
        formData.append('topicName', name);
        formData.append('status', status);
        if (imageFile) {
            formData.append('topicImage', imageFile);
        }
        
        onSubmit(formData);
    };

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
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit}>
                            <header className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {mode === 'edit' ? 'Edit Topik' : 'Tambah Topik'}
                                </h2>
                                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><CloseIcon /></button>
                            </header>

                            <main className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Nama Topik</label>
                                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
                                </div>
                                
                                <div>
                                    <label htmlFor="topicImage" className="block text-sm font-medium text-gray-600 mb-1">Gambar Topik (Opsional saat edit)</label>
                                    <input type="file" id="topicImage" name="topicImage" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg">
                                        <option value="Published">Published</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                            </main>

                            <footer className="p-6 bg-gray-50 rounded-b-2xl">
                                <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600">
                                    {mode === 'edit' ? 'Simpan Perubahan' : 'Tambah'}
                                </button>
                            </footer>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TopicFormModal;