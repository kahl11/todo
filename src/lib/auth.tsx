'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signOut,
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../app/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithPhone: (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    signInWithPhone,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};