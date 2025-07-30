import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioProgressModal = ({ isOpen, message }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="p-8 rounded-2xl flex flex-col items-center gap-4 bg-background-secondary shadow-lg"
                    >
                        <p className="text-xl font-bold text-text animate-pulse">{message}</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AudioProgressModal;