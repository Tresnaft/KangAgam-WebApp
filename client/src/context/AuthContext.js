import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    // --- PERBAIKAN 1: Tambahkan state untuk status loading autentikasi ---
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            
            if (storedUser && storedToken) {
                const userObject = JSON.parse(storedUser);
                userObject.token = storedToken;
                setUser(userObject);
            }
        } catch (error) {
            console.error("Gagal mem-parsing data dari localStorage", error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } finally {
            // --- PERBAIKAN 2: Set loading menjadi false setelah pengecekan selesai ---
            setIsAuthLoading(false);
        }
    }, []);

    const login = (userData) => {
        if (!userData || !userData.token) {
            console.error("Mencoba login tanpa data pengguna atau token.");
            return;
        }

        const userToStore = {
            _id: userData._id,
            adminName: userData.adminName,
            adminEmail: userData.adminEmail,
            role: userData.role
        };
        
        localStorage.setItem('user', JSON.stringify(userToStore));
        localStorage.setItem('token', userData.token);

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

    // --- PERBAIKAN 3: Kirim isAuthLoading melalui provider ---
    return (
        <AuthContext.Provider value={{ user, token, isAuthLoading, login, logout }}>
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