import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './router/AppRoutes';
import './App.css';

function App() {
  console.log("VARIABEL YANG TERLIHAT OLEH REACT:", process.env);
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;