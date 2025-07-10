import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoutes, AdminRoute } from './ProtectedRoutes';

import OnboardingPage from '../pages/OnboardingPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import HomePage from '../pages/HomePage';
import AdminDashboard from '../pages/admin/AdminDashboard';

const NotFoundPage = () => (
    <h1 className="text-3xl p-10">404 - Halaman Tidak Ditemukan</h1>
)

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<OnboardingPage/>}/>
                <Route path="/admin/login" element={<AdminLoginPage/>}/>

                <Route element={<ProtectedRoutes/>}>
                    <Route path="/home" element={<HomePage/>}/>
                </Route>

                <Route path="/admin" element={<AdminRoute/>}>
                    <Route path="/admin/dashboard" element={<AdminDashboard/>} /> 
                </Route>

                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;