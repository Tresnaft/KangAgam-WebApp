import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
    const navigate = useNavigate()
    const { user, login } = useAuth();
    const [credentials, setCredentials] = useState({ email:'', password:'' })
    const [error, setError] = useState('')

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin/dashboard', { replace: true })
        }
    }, [user, navigate])

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (credentials.email === 'admin@kangagam.com' && credentials.password === 'kang12345') {
            const adminData = {
                email: credentials.email,
                role: 'admin'
            }

            login(adminData)
            navigate('/admin/dashboard')
        } else {
            setError('Email atau password salah!')
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="p-8 bg-white shadow-lg rounded-xl max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4">Admin Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLoginPage