import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';
import Button from '../UI/Button'; 

const ProtectedRoute = ({ children }) => {
  const { currentUser, loginWithGoogle } = useAuth();

  if (!currentUser) {
    // Instead of redirecting, show a prompt to login
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full text-center animate-in fade-in zoom-in duration-500 px-4">
        <Lock size={64} className="text-monke-error mb-6" />
        <h2 className="text-3xl text-monke-light font-bold mb-4 font-mono">Login Required</h2>
        <p className="text-monke-text mb-8 max-w-md font-mono text-sm leading-relaxed">
          The Ranked Arena is locked for guests. Please log in to compete, track your MMR, and save your match history.
        </p>
        <Button onClick={loginWithGoogle}>
          Login with Google
        </Button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;