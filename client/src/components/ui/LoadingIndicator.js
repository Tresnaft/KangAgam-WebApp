import React from 'react';
import { motion } from 'framer-motion';

// Varian animasi untuk container, untuk mengatur animasi anak-anaknya
const containerVariants = {
  start: {
    transition: {
      staggerChildren: 0.1, // Beri jeda 0.1s antara animasi setiap lingkaran
    },
  },
  end: {},
};

// Varian animasi untuk setiap lingkaran
const circleVariants = {
  start: {
    y: '0%', // Posisi awal
  },
  end: {
    y: '100%', // Posisi akhir
  },
};

// Pengaturan transisi untuk lingkaran agar berulang (looping)
const circleTransition = {
  duration: 0.4,
  repeat: Infinity, // Ulangi animasi selamanya
  repeatType: 'reverse', // Kembali ke posisi awal dengan mulus
  ease: 'easeInOut',
};

const LoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center w-full h-full p-10">
      <motion.div
        className="w-16 h-8 flex justify-around"
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        <motion.span
          className="block w-4 h-4 bg-indigo-500 rounded-full"
          variants={circleVariants}
          transition={circleTransition}
        />
        <motion.span
          className="block w-4 h-4 bg-indigo-500 rounded-full"
          variants={circleVariants}
          transition={circleTransition}
        />
        <motion.span
          className="block w-4 h-4 bg-indigo-500 rounded-full"
          variants={circleVariants}
          transition={circleTransition}
        />
      </motion.div>
    </div>
  );
};

export default LoadingIndicator;
