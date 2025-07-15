import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AdminFormModal = ({ isOpen, onClose, onSubmit, mode, initialData }) => {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', role: 'Admin' });

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({ email: initialData.email, password: '', confirmPassword: '', role: initialData.role });
        } else {
            setFormData({ email: '', password: '', confirmPassword: '', role: 'Admin' });
        }
    }, [isOpen, mode, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'add' && formData.password !== formData.confirmPassword) {
            alert("Password dan konfirmasi password tidak cocok!");
            return;
        }
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
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit}>
                            <header className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {mode === 'edit' ? 'Edit Admin' : 'Tambah Admin'}
                                </h2>
                                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                                    <CloseIcon />
                                </button>
                            </header>

                            <main className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">E-Mail</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="password">{mode === 'edit' ? 'Password Baru (Opsional)' : 'Password'}</label>
                                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required={mode === 'add'} />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword">{mode === 'edit' ? 'Konfirmasi Password Baru' : 'Konfirmasi Password'}</label>
                                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required={mode === 'add'} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                                    <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg">
                                        <option value="Admin">Admin</option>
                                        <option value="SuperAdmin">SuperAdmin</option>
                                    </select>
                                </div>
                            </main>

                            <footer className="p-6 bg-gray-50 rounded-b-2xl">
                                <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
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

export default AdminFormModal;