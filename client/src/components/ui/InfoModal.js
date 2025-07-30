import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InfoModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
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
                    className="bg-background-secondary rounded-2xl shadow-xl w-full max-w-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    <main className="p-8 text-center">
                        <h2 className="text-xl font-bold text-text">{title}</h2>
                        <p className="text-text-secondary mt-2">{message}</p>
                    </main>

                    <footer className="p-4 bg-background rounded-b-2xl">
                        <button
                            onClick={onClose}
                            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Mengerti
                        </button>
                    </footer>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InfoModal;