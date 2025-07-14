'use client';

import AdminSidebar from '@components/admin/AdminSidebar';
import { RoleContext } from '@components/providers/RoleContext';
import { Box, CircularProgress } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { auth, db } from '@/lib/firebase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
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
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AdminSidebar role={role} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </RoleContext.Provider>
  );
}
