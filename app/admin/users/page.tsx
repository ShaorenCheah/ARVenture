'use client';

import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import VerifiedIcon from '@mui/icons-material/Verified';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Pagination,
  useMediaQuery,
  useTheme,
  Skeleton,
  Chip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import CreateUserModal from './CreateUserModal';
import { fetchUsers, UserRecord } from './services/userServices';

export default function AdminUserPage() {
  const router = useRouter();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);
    try {
      const result = await fetchUsers();
      setUsers(result);
    } catch {
      toast.error('Failed to load users');
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const nameMatch =
      filterName.trim() === '' ||
      user.displayName?.toLowerCase().includes(filterName.toLowerCase());
    const roleMatch =
      filterRole.trim() === '' || user.role.toLowerCase() === filterRole.toLowerCase();
    return nameMatch && roleMatch;
  });

  const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleDelete = async (uid: string, displayName: string) => {
    if (!confirm(`Are you sure you want to delete "${displayName}"?`)) return;

    try {
      const res = await fetch('/admin/users/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success('User deleted successfully');
      await loadUsers(); // refresh the list
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      toast.error(message);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 1, md: 3, lg: 4 },
          py: { xs: 1, md: 2, lg: 3 },
          gap: 3,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography variant="h1" fontWeight={600}>
            Users
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2 }}
            onClick={() => setOpenCreateModal(true)}
          >
            Add User
          </Button>
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 3 },
            boxShadow: 0,
            borderRadius: 1.5,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h6" fontWeight={500} mb={1}>
            Filter Users
          </Typography>
          <Stack
            spacing={isMobile ? 1 : 2}
            direction={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'stretch' : 'center'}
            flexWrap="wrap"
          >
            <TextField
              label="Search Name"
              size="small"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              sx={{ width: { xs: '100%', md: '400px' } }}
            />
            <TextField
              label="Role"
              size="small"
              select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              sx={{ width: { xs: '100%', md: '200px' } }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </TextField>
          </Stack>
          <Stack direction="row" spacing={1} mt={3}>
            <Button
              variant="outlined"
              onClick={() => {
                setFilterName('');
                setFilterRole('');
              }}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Clear Filter
            </Button>
          </Stack>
        </Paper>

        <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ boxShadow: 1, borderRadius: 1.5, backgroundColor: 'white' }}
          >
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '120px' }}>
                    <strong>No.</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Information</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Role</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Delegated Spot</strong>
                  </TableCell>
                  <TableCell align="center" sx={{ width: '200px' }}>
                    <strong>Manage</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: rowsPerPage }).map((_, idx) => (
                    <TableRow key={idx}>
                      {[...Array(7)].map((_, colIdx) => (
                        <TableCell key={colIdx}>
                          <Skeleton height={24} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, index) => (
                    <TableRow
                      key={user.id}
                      sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : 'white' }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} mb={1}>
                          #{(page - 1) * rowsPerPage + index + 1}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(user.createdAt).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>{user.displayName || '-'}</TableCell>
                      <TableCell>
                        <Stack spacing={1.5}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <EmailIcon fontSize="small" sx={{ color: 'brand.main' }} />
                            <Typography variant="body2">{user.email}</Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <FingerprintIcon fontSize="small" sx={{ color: 'brand.main' }} />
                            <Typography variant="caption" color="text.secondary">
                              ID: {user.id}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={user.emailVerified ? 'Verified' : 'Unverified'}
                          size="small"
                          icon={
                            user.emailVerified ? (
                              <VerifiedIcon fontSize="small" />
                            ) : (
                              <CancelIcon fontSize="small" />
                            )
                          }
                          color={user.emailVerified ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </TableCell>
                      <TableCell align="center">
                        {user.role === 'employee' &&
                        typeof user.delegatedSpot === 'string' &&
                        user.delegatedSpot.trim()
                          ? user.delegatedSpot
                              .split('_')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')
                          : 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        {user.role === 'user' && (
                          <IconButton onClick={() => router.push(`/admin/users/${user.id}`)}>
                            <VisibilityIcon sx={{ color: 'text.disabled' }} />
                          </IconButton>
                        )}
                        <IconButton onClick={() => handleDelete(user.id, user.displayName)}>
                          <DeleteIcon sx={{ color: 'brand.main' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No users found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" justifyContent="flex-end" pt={4} pb={2}>
            <Pagination
              count={Math.ceil(filteredUsers.length / rowsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Stack>
        </Box>
      </Box>

      <CreateUserModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        reloadUsers={loadUsers}
      />
    </>
  );
}
