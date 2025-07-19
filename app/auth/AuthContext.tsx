'use client';

import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { createContext, useEffect, useState, useContext, ReactNode } from 'react';

import { auth, db } from '@/lib/firebase';

interface AuthContextProps {
  user: User | null;
  role: string | null;
  loading: boolean;
  delegatedSpotName?: string | null;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  role: null,
  delegatedSpotName: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [delegatedSpotName, setDelegatedSpotName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const roleValue = userDoc.exists() ? userDoc.data().role || 'user' : 'user';
        setRole(roleValue);

        if (roleValue === 'employee') {
          const userData = userDoc.data();
          const delegatedSpotId = userData?.delegatedSpot;
          if (delegatedSpotId) {
            const spotQuery = await getDoc(doc(db, 'ar_spots', delegatedSpotId));
            if (spotQuery.exists()) {
              setDelegatedSpotName(spotQuery.data().name || null);
            }
          }
        }
      } catch {
        setRole('user');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, delegatedSpotName, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
