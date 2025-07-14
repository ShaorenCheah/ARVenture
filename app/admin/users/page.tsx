'use client';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
} from '@mui/material';
import { useState } from 'react';

export default function AdminUserPage() {
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Dummy data example
  const users = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['Admin', 'Merchant', 'User'][i % 3],
    createdAt: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  }));

  const paginatedUsers = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Typography variant="h1" fontWeight={600}>
          Users
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }}>
          Add User
        </Button>
      </Stack>

      {/* Filter Section */}
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
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Merchant">Merchant</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </TextField>
        </Stack>
        <Stack direction="row" spacing={1} mt={3}>
          <Button variant="contained" sx={{ borderRadius: 2, px: 3 }}>
            Filter
          </Button>
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

      {/* Table Section with full height minus header/filter/footer */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ boxShadow: 1, borderRadius: 1.5, backgroundColor: 'white' }}
        >
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '120px' }}>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Role</strong>
                </TableCell>
                <TableCell align="center" sx={{ width: '200px' }}>
                  <strong>Manage</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user, index) => (
                <TableRow
                  key={index}
                  sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : 'white' }}
                >
                  <TableCell sx={{ width: '120px' }}>
                    <Typography variant="body2" fontWeight={600}>
                      #{user.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.createdAt}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell align="center" sx={{ width: '200px' }}>
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" justifyContent="flex-end" pt={4} pb={2}>
          <Pagination
            count={Math.ceil(users.length / rowsPerPage)}
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
