import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { ProtectedRoutes, AdminRoute } from './ProtectedRoutes'; 
import UserLayout from '../components/layout/UserLayout';
import AdminLayout from '../components/layout/AdminLayout';
import OnboardingPage from '../pages/OnboardingPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import HomePage from '../pages/HomePage';
import KosakataPage from '../pages/KosakataPage';
import QuizPage from '../pages/QuizPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageTopicsPage from '../pages/admin/ManageTopicsPage';
import ManageWordsPage from '../pages/admin/ManageWordsPage';
import ManageAdminsPage from '../pages/admin/ManageAdminsPage';
import StatisticsPage from '../pages/admin/StatisticsPage';
import ManageLearnersPage from '../pages/admin/ManageLearnersPage';

const NotFoundPage = () => (
    <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold">404 - Halaman Tidak Ditemukan</h1>
    </div>
);

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Rute Publik */}
                <Route path="/" element={<OnboardingPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* --- PERBAIKAN STRUKTUR DIMULAI DI SINI --- */}

                {/* Rute User Terproteksi (Hanya untuk role 'user') */}
                <Route element={<ProtectedRoutes />}>
                    <Route element={<UserLayout />}>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/topik/:topicId" element={<KosakataPage />} />
                        <Route path="/quiz/:topicId" element={<QuizPage />} />
                    </Route>
                </Route>

                {/* Rute Admin (Hanya untuk role 'admin' dan 'superadmin') */}
                {/* Ini sekarang berada di level yang sama dengan ProtectedRoutes, tidak lagi di dalamnya */}
                <Route path="/admin" element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="manage-topics" element={<ManageTopicsPage />} />
                        <Route path="manage-topics/:topicId" element={<ManageWordsPage />} />
                        <Route path="manage-admins" element={<ManageAdminsPage />} />
                        <Route path="statistics" element={<StatisticsPage />} />
                        <Route path="manage-learners" element={<ManageLearnersPage />} />
                    </Route>
                </Route>
                
                {/* --- PERBAIKAN STRUKTUR SELESAI --- */}
                
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </AnimatePresence>
    );
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default AppRoutes;