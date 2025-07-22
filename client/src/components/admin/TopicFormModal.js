import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const TopicFormModal = ({ isOpen, onClose, onSubmit, mode, initialData }) => {
    const [topicNames, setTopicNames] = useState({ id: '', su: '', en: '' });
    const [status, setStatus] = useState('Published');
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            // --- DEBUGGING DIMULAI DI SINI ---
            // Kita akan log `initialData` untuk melihat strukturnya saat mode 'edit'
            if (mode === 'edit') {
                console.log("Data yang diterima oleh Modal:", initialData);
            }
            // --- DEBUGGING SELESAI ---

            if (mode === 'edit' && initialData) {
                const names = { id: '', su: '', en: '' };
                
                // --- PERBAIKAN LOGIKA ---
                // Kita akan menggunakan 'allTopicNames' yang dikirim dari API
                const namesArray = initialData.allTopicNames || initialData.topicName;

                if (Array.isArray(namesArray)) {
                    namesArray.forEach(item => {
                        if (names.hasOwnProperty(item.lang)) {
                            names[item.lang] = item.value;
                        }
                    });
                }
                // -------------------------

                setTopicNames(names);
                setStatus(initialData.status || 'Published');
            } else {
                setTopicNames({ id: '', su: '', en: '' });
                setStatus('Published');
                setImageFile(null);
            }
            setError('');
        }
    }, [isOpen, mode, initialData]);

    const handleNameChange = (lang, value) => {
        setTopicNames(prev => ({ ...prev, [lang]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!topicNames.id) {
            setError('Nama Topik dalam Bahasa Indonesia wajib diisi.');
            return;
        }
        if (mode === 'add' && !imageFile) {
            setError('Silakan pilih gambar untuk topik.');
            return;
        }
        
        const formData = new FormData();
        
        const topicNamesArray = Object.keys(topicNames)
            .filter(lang => topicNames[lang])
            .map(lang => ({ lang, value: topicNames[lang] }));

        formData.append('topicNames', JSON.stringify(topicNamesArray));
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
                        className="bg-background-secondary rounded-2xl shadow-xl w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit}>
                            <header className="flex items-center justify-between p-6 border-b border-background">
                                <h2 className="text-xl font-bold text-text">
                                    {mode === 'edit' ? 'Edit Topik' : 'Tambah Topik'}
                                </h2>
                                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-background"><CloseIcon /></button>
                            </header>

                            <main className="p-6 space-y-4">
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                
                                <div>
                                    <label htmlFor="name-id" className="block text-sm font-medium text-text-secondary mb-1">Nama Topik (Indonesia)</label>
                                    <input type="text" id="name-id" value={topicNames.id} onChange={(e) => handleNameChange('id', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-text" required />
                                </div>
                                <div>
                                    <label htmlFor="name-su" className="block text-sm font-medium text-text-secondary mb-1">Nama Topik (Sunda)</label>
                                    <input type="text" id="name-su" value={topicNames.su} onChange={(e) => handleNameChange('su', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-text" />
                                </div>
                                <div>
                                    <label htmlFor="name-en" className="block text-sm font-medium text-text-secondary mb-1">Nama Topik (Inggris)</label>
                                    <input type="text" id="name-en" value={topicNames.en} onChange={(e) => handleNameChange('en', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-text" />
                                </div>
                                
                                <div>
                                    <label htmlFor="topicImage" className="block text-sm font-medium text-text-secondary mb-1">Gambar Topik {mode === 'edit' && '(Opsional)'}</label>
                                    <input type="file" id="topicImage" name="topicImage" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
                                        className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-text">
                                        <option value="Published">Published</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                            </main>

                            <footer className="p-6 bg-background rounded-b-2xl">
                                <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90">
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