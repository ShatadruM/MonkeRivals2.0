import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/UI/Navbar';
import Home from './pages/Home';
import Arena from './pages/Arena';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext'; // <--- Import this

function App() {
  return (
    // 1. Wrap the entire Router in AuthProvider
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-monke-bg text-monke-text font-mono selection:bg-monke-main selection:text-monke-bg">
          
          {/* Navbar is now inside AuthProvider, so useAuth() will work */}
          <Navbar />

          <main className="w-full">
            <Routes>
              {/* Specific Route First */}
              <Route 
                path="/arena" 
                element={
                  <ProtectedRoute>
                    <Arena />
                  </ProtectedRoute>
                } 
              />
              
              {/* Generic Route Last */}
              <Route path="/" element={<Home />} />
              
              {/* 404 */}
              <Route path="*" element={
                <div className="text-center mt-20 text-4xl text-monke-error">404</div>
              } />
            </Routes>
          </main>

          <footer className="fixed bottom-4 right-6 text-xs opacity-30 hover:opacity-100 transition">
            v1.0.0 | MonkeRivals
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;