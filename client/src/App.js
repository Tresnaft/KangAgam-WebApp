import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './router/AppRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;