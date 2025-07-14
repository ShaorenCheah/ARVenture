'use client';

import AdminSidebar from '@components/admin/AdminSidebar';
import ClientProviders from '@components/providers/ClientProviders';
import { RoleContext } from '@components/providers/RoleContext';
import ThemeProviders from '@components/providers/ThemeRegistry';
import { Box, CircularProgress } from '@mui/material';
import { deleteCookie } from 'cookies-next';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { auth, db } from '@/lib/firebase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut(auth);
      deleteCookie('role');
      toast.success('Logged out successfully.');
      router.replace('/');
    } catch {
      toast.error('Failed to log out. Please try again.');
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        const userRole = docSnap.exists() ? docSnap.data()?.role : null;

        if (userRole === 'admin' || userRole === 'merchant') {
          setRole(userRole);
        } else {
          router.replace('/');
        }
      } else {
        router.replace('/');
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <Box
        sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <RoleContext.Provider value={role}>
      <ThemeProviders>
        <ClientProviders>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar
              role={role}
              userName={user?.displayName || 'Admin'}
              userRole={role ?? undefined}
              currentPath={location.pathname}
              onNavigate={router.push}
              onLogout={handleLogout}
            />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              {children}
            </Box>
          </Box>
        </ClientProviders>
      </ThemeProviders>
    </RoleContext.Provider>
  );
}
