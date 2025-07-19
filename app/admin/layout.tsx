'use client';

import { useAuth } from '@auth/AuthContext';
import AdminSidebar from '@components/admin/AdminSidebar';
import AdminProviders from '@components/providers/AdminProviders';
import { Box, CircularProgress } from '@mui/material';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AdminProviders>
      <AdminLayout>{children}</AdminLayout>
    </AdminProviders>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const isAuthorized = role === 'admin' || role === 'employee';

  console.log('[Layout] Ready to render:', { user, role, loading });

  if (loading) {
    return (
      <Box
        sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <CircularProgress sx={{ color: '#ED1D24' }} />
      </Box>
    );
  }

  if (!user || !isAuthorized) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar
        role={role}
        userName={user.displayName || user.email || 'User'}
        userRole={role}
        onNavigate={(path) => window.location.assign(path)}
        onLogout={async () => {
          const { signOut } = await import('firebase/auth');
          const { auth } = await import('@/lib/firebase');
          await signOut(auth);
          document.cookie = 'role=; Max-Age=0; path=/';
          window.location.href = '/';
        }}
      />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100vh',
          p: { xs: 2, md: 4 },
          gap: 3,
          bgcolor: '#f9fafb',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
