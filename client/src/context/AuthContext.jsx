import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import LoadingScreen from '../components/UI/LoadingScreen';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Firebase User (Auth)
  const [mongoUser, setMongoUser] = useState(null);     // MongoDB User (Stats/MMR)
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  const logout = () => {
    setMongoUser(null);
    return signOut(auth);
  };

  // --- Sync Logic ---
  const syncWithBackend = async (firebaseUser) => {
    if (!firebaseUser) return;

    try {
      // Getting the JWT token from Firebase
      const token = await firebaseUser.getIdToken();
      
      //  Sending to Backend
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMongoUser(data); // Store the DB data (MMR, Wins, etc.)
        console.log("Synced with MongoDB:", data);
      } else {
        console.error("Backend Sync Failed");
      }
    } catch (error) {
      console.error("Error syncing with backend:", error);
    }
  };

  useEffect(() => {
    // FIX: Make this callback async so we can wait for MongoDB data
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // If logged in, WAIT for the backend sync to finish
        // This ensures mongoUser is populated BEFORE loading becomes false
        await syncWithBackend(user);
      } else {
        setMongoUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    mongoUser, // Now guaranteed to be set if logged in (before children render)
    loginWithGoogle,
    logout
  };

 if (loading) {
    return <LoadingScreen message="Initializing..." fullscreen={true} />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};