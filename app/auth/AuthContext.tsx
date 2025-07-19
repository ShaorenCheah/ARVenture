'use client';

import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { createContext, useEffect, useState, useContext, ReactNode } from 'react';

import { auth, db } from '@/lib/firebase';

interface AuthContextProps {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[Auth] onAuthStateChanged triggered');
      setUser(firebaseUser);

      if (!firebaseUser) {
        console.log('[Auth] No user found');
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const roleValue = userDoc.exists() ? userDoc.data().role || 'user' : 'user';
        console.log('[Auth] Role loaded:', roleValue);
        setRole(roleValue);
      } catch (error) {
        console.error('[Auth] Failed to load role:', error);
        setRole('user');
      } finally {
        setLoading(false);
        console.log('[Auth] Finished loading');
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, role, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
