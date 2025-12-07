import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Keyboard, Swords, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import Hook

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, loginWithGoogle, logout } = useAuth(); // Get Auth State

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="w-full max-w-6xl mx-auto py-6 px-6 flex justify-between items-center select-none">
      
      {/* Logo */}
      <button 
        onClick={() => handleNavigation('/')}
        className="flex items-center gap-2 group hover:opacity-90 transition-opacity cursor-pointer bg-transparent border-none p-0"
      >
        <Keyboard className="text-monke-main w-8 h-8 group-hover:-rotate-12 transition-transform duration-300" />
        <h1 className="text-monke-light text-2xl font-bold font-mono tracking-tighter">
          Monke<span className="text-monke-main">Rivals</span>
        </h1>
      </button>

      {/* Navigation */}
      <div className="flex gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
        <button 
          onClick={() => handleNavigation('/')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-200 font-mono text-sm cursor-pointer ${isActive('/') ? 'bg-monke-main text-monke-bg font-bold' : 'text-monke-text hover:text-monke-light hover:bg-white/5'}`}
        >
          <Keyboard size={16} />
          <span>Solo</span>
        </button>

        {/* Arena Button - Disabled visually if not logged in (optional, or let ProtectedRoute handle it) */}
        <button 
          onClick={() => handleNavigation('/arena')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-200 font-mono text-sm cursor-pointer ${isActive('/arena') ? 'bg-monke-main text-monke-bg font-bold' : 'text-monke-text hover:text-monke-light hover:bg-white/5'}`}
        >
          <Swords size={16} />
          <span>Arena</span>
        </button>
      </div>

      {/* User Auth Section */}
      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-4">
            {/* User Profile */}
            <div className="flex items-center gap-2" onClick={() => handleNavigation('/profile')}>
              <img 
                src={currentUser.photoURL} 
                alt="User" 
                className="w-8 h-8 rounded-full border border-monke-main"
              />
              <span className="text-monke-light text-sm hidden sm:block">
                {currentUser.displayName.split(' ')[0]}
              </span>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={logout}
              className="text-monke-error hover:text-red-400 transition p-2"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          /* Login Button */
          <button 
            onClick={loginWithGoogle}
            className="flex items-center gap-2 px-4 py-2 text-monke-text hover:text-monke-light transition-colors font-mono text-sm rounded-lg hover:bg-white/5 cursor-pointer"
          >
            
            <span>Login</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;