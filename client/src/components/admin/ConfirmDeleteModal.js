import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                // 2. Tambahkan 'backdrop-blur-sm' di sini juga
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
                        className="bg-white rounded-2xl shadow-xl w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <main className="p-8 text-center">
                            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                            <p className="text-gray-600 mt-2">{message}</p>
                        </main>

                        <footer className="p-4 grid grid-cols-2 gap-3 bg-gray-50 rounded-b-2xl">
                            <button
                                onClick={onClose}
                                className="bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={onConfirm}
                                className="bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Hapus
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDeleteModal;