import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Load user and token from localStorage on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            if (storedToken) {
                setToken(storedToken);
            }
        } catch (error) {
            console.error("Gagal mem-parsing data dari localStorage", error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }, []);

    const login = (userData) => {
        // Ensure userData has role and token
        if (!userData || !userData.role || !userData.token) {
            console.error("Mencoba login tanpa data pengguna, role, atau token.");
            return;
        }
        localStorage.setItem('user', JSON.stringify({ _id: userData._id, username: userData.username, role: userData.role }));
        localStorage.setItem('token', userData.token);
        setUser({ _id: userData._id, username: userData.username, role: userData.role });
        setToken(userData.token);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

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