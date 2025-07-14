'use client';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
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
import { useState, useEffect } from 'react';
import { fetchUsers, UserRecord } from './services/userServices';

export default function AdminUserPage() {
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      const result = await fetchUsers();
      setUsers(result);
      setLoading(false);
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const nameMatch = filterName.trim() === '' || user.displayName?.toLowerCase().includes(filterName.toLowerCase());
    const roleMatch = filterRole.trim() === '' || user.role.toLowerCase() === filterRole.toLowerCase();
    return nameMatch && roleMatch;
  });

  const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
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
        <Typography variant="h1" fontWeight={600}>Users</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }}>Add User</Button>
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
        <Typography variant="h6" fontWeight={500} mb={1}>Filter Users</Typography>
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
            <MenuItem value="Merchant">Merchant</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </TextField>
        </Stack>
        <Stack direction="row" spacing={1} mt={3}>
          <Button variant="contained" sx={{ borderRadius: 2, px: 3 }}>Filter</Button>
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
                <TableCell sx={{ width: '120px' }}><strong>No.</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Role</strong></TableCell>
                <TableCell align="center" sx={{ width: '200px' }}><strong>Manage</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton width={60} height={24} /></TableCell>
                    <TableCell><Skeleton width="80%" height={24} /></TableCell>
                    <TableCell><Skeleton width="90%" height={24} /></TableCell>
                    <TableCell align="center"><Skeleton width="20%" height={24} /></TableCell>
                    <TableCell align="center"><Skeleton width="20%" height={24} /></TableCell>
                    <TableCell align="center"><Skeleton variant="rectangular" width='100%' height={32} /></TableCell>
                  </TableRow>
                ))
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <TableRow key={user.id} sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : 'white' }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} mb={1}>#{(page - 1) * rowsPerPage + index + 1}</Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(user.createdAt).toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell>{user.displayName || '-'}</TableCell>
                    <TableCell>
                      <Stack spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <EmailIcon fontSize="small" sx={{color:'brand.main'}}/><Typography variant="body2">{user.email}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <FingerprintIcon fontSize="small" sx={{color:'brand.main'}}/><Typography variant="caption" color="text.secondary">ID: {user.id}</Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.emailVerified ? 'Verified' : 'Unverified'}
                        size="small"
                        icon={user.emailVerified ? <VerifiedIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                        color={user.emailVerified ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</TableCell>
                    <TableCell align="center">
                      <IconButton><DeleteIcon sx={{color:'brand.main'}}/></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">No users found.</Typography>
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
  );
}
