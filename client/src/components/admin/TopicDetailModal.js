import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Ikon untuk tombol tutup
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const TopicDetailModal = ({ topic, onClose }) => {
    // Efek untuk mengunci scroll body saat modal terbuka
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!topic) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: "100vh" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100vh" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-[#DAE4EE] w-full h-full flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Modal */}
                    <header className="flex items-center justify-between p-4 border-b border-gray-300">
                        <h2 className="text-xl font-bold text-gray-800">{topic.name}</h2>
                        <button onClick={onClose} className="p-2 text-gray-700 hover:text-black">
                            <CloseIcon />
                        </button>
                    </header>

                    {/* Konten Detail */}
                    <div className="p-6 space-y-4 flex-grow">
                        <div className="bg-white/70 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Total Kosakata</p>
                            <p className="text-lg font-semibold">{topic.totalWords}</p>
                        </div>
                        <div className="bg-white/70 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Terakhir Diupdate</p>
                            <p className="text-lg font-semibold">{topic.lastUpdated}</p>
                        </div>
                        <div className="bg-white/70 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                                topic.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {topic.status}
                            </span>
                        </div>
                    </div>

                    {/* Footer Aksi */}
                    <footer className="p-4 grid grid-cols-3 gap-3 border-t border-gray-300">
                         <Link 
                            to={`/admin/manage-topics/${topic.name.toLowerCase()}`}
                            className="bg-blue-500 text-white text-center font-bold py-3 rounded-lg hover:bg-blue-600"
                        >
                            Lihat Kosakata
                        </Link>
                        <button className="bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600">Edit</button>
                        <button className="bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600">Delete</button>
                    </footer>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TopicDetailModal;