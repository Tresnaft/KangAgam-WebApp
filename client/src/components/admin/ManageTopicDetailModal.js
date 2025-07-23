import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Komponen Ikon
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ManageTopicDetailModal = ({ topic, onClose, onEdit, onDelete }) => {
    return (
        <AnimatePresence>
            {topic && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    // --- PERBAIKAN 3: Turunkan z-index agar modal lain bisa di atasnya ---
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        // --- PERBAIKAN 2: Tambahkan padding bawah untuk ruang ekstra ---
                        className="bg-white w-full rounded-t-2xl flex flex-col pb-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800">{topic.topicName}</h2>
                            <button onClick={onClose} className="p-2 text-gray-700 hover:text-black">
                                <CloseIcon />
                            </button>
                        </header>

                        <div className="p-4 space-y-3">
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Total Kosakata</p>
                                <p className="text-base font-semibold">{topic.topicEntries.length}</p>
                            </div>
                        </div>

                        <footer className="p-4 pt-0 grid grid-cols-3 gap-3 border-t-0">
                             <Link 
                                to={`/admin/manage-topics/${topic._id}`}
                                className="bg-blue-500 text-white text-center font-bold py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center text-sm"
                            >
                                Kosakata
                            </Link>
                            <button onClick={onEdit} className="bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 text-sm">Edit</button>
                            <button onClick={onDelete} className="bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 text-sm">Hapus</button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ManageTopicDetailModal;