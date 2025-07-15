'use client';

import { getCookie, deleteCookie } from 'cookies-next';
import { User, onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState, useContext, ReactNode } from 'react';

import { auth } from '@/lib/firebase';

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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      const cookieRole = getCookie('role');
      setRole(typeof cookieRole === 'string' ? cookieRole : null);

      if (!firebaseUser) {
        deleteCookie('role');
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, role, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
