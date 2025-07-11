import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Import komponen "penjaga" rute
import { ProtectedRoutes, AdminRoute } from './ProtectedRoutes';

// 2. Import komponen Layout
import UserLayout from '../components/layout/UserLayout';

// 3. Import semua komponen Halaman (Pages)
// Halaman Publik
import OnboardingPage from '../pages/OnboardingPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';

// Halaman User (yang akan dibungkus oleh UserLayout)
import HomePage from '../pages/HomePage';
import KosakataPage from '../pages/KosakataPage';
import QuizPage from '../pages/QuizPage';

// Halaman Admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminLayout from '../components/layout/AdminLayout';


// Komponen untuk Halaman 404 Not Found
const NotFoundPage = () => (
    <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold">404 - Halaman Tidak Ditemukan</h1>
    </div>
);


// 4. Definisikan semua rute dalam komponen AppRoutes
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ====================================================== */}
        {/* RUTE PUBLIK - Bisa diakses siapa saja                 */}
        {/* ====================================================== */}
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />


        {/* ====================================================== */}
        {/* RUTE USER - Dilindungi & Menggunakan Layout Konsisten   */}
        {/* ====================================================== */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<UserLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/topik/:topicId" element={<KosakataPage />} />
            <Route path="/quiz/:topicId" element={<QuizPage />} />
          </Route>
        </Route>


        {/* ====================================================== */}
        {/* RUTE ADMIN - Dilindungi & Tanpa UserLayout            */}
        {/* ====================================================== */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}> {/* BUNGKUS DENGAN ADMIN LAYOUT */}
              <Route index element={<AdminDashboard />} /> 
              <Route path="dashboard" element={<AdminDashboard />} />
              {/* Halaman admin lain akan otomatis punya sidebar */}
          </Route>
      </Route>
        

        {/* ====================================================== */}
        {/* RUTE NOT FOUND - Untuk URL yang tidak terdaftar       */}
        {/* ====================================================== */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;