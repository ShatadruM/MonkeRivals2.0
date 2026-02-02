import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Keyboard, Swords, LogIn, LogOut, Menu, X, User } from 'lucide-react'; // Added Menu, X, User
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu on click
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    loginWithGoogle();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="relative w-full max-w-6xl mx-auto py-4 px-4 md:py-6 md:px-6 select-none z-50">
      <div className="flex justify-between items-center">
        
        {/* --- LOGO --- */}
        <button 
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-2 group hover:opacity-90 transition-opacity cursor-pointer bg-transparent border-none p-0"
        >
          <Keyboard className="text-monke-main w-6 h-6 md:w-8 md:h-8 group-hover:-rotate-12 transition-transform duration-300" />
          <h1 className="text-monke-light text-xl md:text-2xl font-bold font-mono tracking-tighter">
            Monke<span className="text-monke-main">Rivals</span>
          </h1>
        </button>

        {/* --- DESKTOP: Navigation (Hidden on Mobile) --- */}
        <div className="hidden md:flex gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
          <button 
            onClick={() => handleNavigation('/')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-200 font-mono text-sm cursor-pointer ${isActive('/') ? 'bg-monke-main text-monke-bg font-bold' : 'text-monke-text hover:text-monke-light hover:bg-white/5'}`}
          >
            <Keyboard size={16} />
            <span>Solo</span>
          </button>

          <button 
            onClick={() => handleNavigation('/arena')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-200 font-mono text-sm cursor-pointer ${isActive('/arena') ? 'bg-monke-main text-monke-bg font-bold' : 'text-monke-text hover:text-monke-light hover:bg-white/5'}`}
          >
            <Swords size={16} />
            <span>Arena</span>
          </button>
        </div>

        {/* --- DESKTOP: Auth Section (Hidden on Mobile) --- */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation('/profile')}>
                <img 
                  src={currentUser.photoURL} 
                  alt="User" 
                  className="w-8 h-8 rounded-full border border-monke-main"
                />
                <span className="text-monke-light text-sm">
                  {currentUser.displayName.split(' ')[0]}
                </span>
              </div>
              <button 
                onClick={logout}
                className="text-monke-error hover:text-red-400 transition p-2"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={loginWithGoogle}
              className="flex items-center gap-2 px-4 py-2 text-monke-text hover:text-monke-light transition-colors font-mono text-sm rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <span>Login</span>
            </button>
          )}
        </div>

        {/* --- MOBILE: Hamburger Toggle --- */}
        <button 
            className="md:hidden text-monke-text hover:text-monke-main transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-4 flex flex-col gap-4 md:hidden animate-in fade-in slide-in-from-top-2 z-50">
            
            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-2">
                <button 
                    onClick={() => handleNavigation('/')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm ${isActive('/') ? 'bg-monke-main/10 text-monke-main border border-monke-main/20' : 'text-monke-text hover:bg-white/5'}`}
                >
                    <Keyboard size={18} />
                    <span>Solo Practice</span>
                </button>
                <button 
                    onClick={() => handleNavigation('/arena')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm ${isActive('/arena') ? 'bg-monke-main/10 text-monke-main border border-monke-main/20' : 'text-monke-text hover:bg-white/5'}`}
                >
                    <Swords size={18} />
                    <span>Arena Mode</span>
                </button>
            </div>

            <div className="h-px bg-white/10 w-full my-1"></div>

            {/* Mobile Auth */}
            {currentUser ? (
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => handleNavigation('/profile')}
                        className="flex items-center gap-3 px-2 py-2 text-monke-light hover:bg-white/5 rounded-lg transition"
                    >
                        <img 
                            src={currentUser.photoURL} 
                            alt="User" 
                            className="w-8 h-8 rounded-full border border-monke-main"
                        />
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-bold">{currentUser.displayName}</span>
                            <span className="text-xs text-monke-text/60">View Profile</span>
                        </div>
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-monke-error hover:bg-red-500/10 rounded-lg transition text-sm font-mono"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            ) : (
                <button 
                    onClick={handleLogin}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 text-monke-light rounded-lg font-mono text-sm transition"
                >
                    <LogIn size={18} />
                    <span>Login with Google</span>
                </button>
            )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;