import React, { use } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleLoginUser = () => {
        login({
            name: "User Biasa",
            role: "user",
        });
        navigate('/home');
    }
    const handleLoginAdmin = () => {
        login({
            name: "Atmin",
            role: "admin",
        });
        navigate('/admin');
    }

    return (
        <div className="text-center p-10">
            <h1 className="text-3xl">Halaman Awal</h1>
            <button onClick={handleLoginUser} className="mt-4 p-2 bg-blue-500 text-white rounded">Login as User</button>
            <button onClick={handleLoginAdmin} className="mt-4 p-2 bg-blue-500 text-white rounded">Login as Admin</button>
        </div>
    )
}

export default LoginPage;