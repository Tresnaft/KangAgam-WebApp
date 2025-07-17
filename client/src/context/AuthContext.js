import React, { createContext, useContext, useState } from "react";
import adminService from "../services/adminService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Saat aplikasi pertama kali dimuat, coba ambil data user dari localStorage
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            // Jika ada error parsing, anggap tidak ada user
            return null;
        }
    });

    // Fungsi login sekarang hanya perlu mengatur state,
    // karena service sudah menyimpan data ke localStorage.
    const login = (userData) => {
        // Tambahkan peran 'admin' jika tidak ada, agar ProtectedRoutes berfungsi
        const userToStore = { ...userData, role: 'admin' };
        setUser(userToStore);
        // Simpan juga ke localStorage untuk konsistensi
        localStorage.setItem('user', JSON.stringify(userToStore));
    };

    const logout = () => {
        adminService.logout(); // Panggil fungsi logout dari service
        setUser(null);
    };

    const value = { user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}