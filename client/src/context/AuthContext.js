import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Kita tetap simpan token terpisah untuk jaga-jaga, tapi sumber utama akan ada di object user
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    useEffect(() => {
        // Logika ini berjalan saat aplikasi pertama kali dimuat atau di-refresh
        try {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            
            if (storedUser && storedToken) {
                // --- PERBAIKAN 1: Gabungkan user dan token saat memuat dari localStorage ---
                // Ini adalah perbaikan paling krusial.
                // Kita pastikan object 'user' di state SELALU memiliki properti 'token'.
                const userObject = JSON.parse(storedUser);
                userObject.token = storedToken;
                setUser(userObject);
            }
        } catch (error) {
            console.error("Gagal mem-parsing data dari localStorage", error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }, []);

    const login = (userData) => {
        if (!userData || !userData.token) {
            console.error("Mencoba login tanpa data pengguna atau token.");
            return;
        }

        // --- PERBAIKAN 2: Simpan data user yang lebih lengkap ---
        // Kita simpan semua data yang relevan agar konsisten.
        const userToStore = {
            _id: userData._id,
            adminName: userData.adminName,
            adminEmail: userData.adminEmail,
            role: userData.role
        };
        
        localStorage.setItem('user', JSON.stringify(userToStore));
        localStorage.setItem('token', userData.token);

        // --- PERBAIKAN 3: Pastikan object 'user' di state juga memiliki token ---
        const userInState = {
            ...userToStore,
            token: userData.token
        };

        setUser(userInState);
        setToken(userData.token);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    // Kita tetap menyediakan 'token' secara terpisah untuk fleksibilitas
    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};