import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

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

  // --- NEW: Sync Logic ---
  const syncWithBackend = async (firebaseUser) => {
    if (!firebaseUser) return;

    try {
      // 1. Get the JWT token from Firebase
      const token = await firebaseUser.getIdToken();
      
      // 2. Send to our Backend
      const response = await fetch('http://localhost:3000/api/auth/sync', {
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // If logged in, fetch game stats immediately
        syncWithBackend(user);
      } else {
        setMongoUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    mongoUser, // Now available to the rest of the app!
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};