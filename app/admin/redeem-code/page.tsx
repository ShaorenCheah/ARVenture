'use client';

import { useAuth } from '@auth/AuthContext';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
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
  Pagination,
  Skeleton,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
} from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import RedeemCodeModal from './RedeemCodeModal';
import { RedemptionItemRecord, fetchRedemptionHistoriesByRole } from './redemptionServices';

export default function RedemptionHistoryPage() {
  const { user, role, loading: authLoading } = useAuth();

  const [filterTitle, setFilterTitle] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [claimedFrom, setClaimedFrom] = useState('');
  const [claimedTo, setClaimedTo] = useState('');
  const [redeemedFrom, setRedeemedFrom] = useState('');
  const [redeemedTo, setRedeemedTo] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);

  const [histories, setHistories] = useState<RedemptionItemRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const rowsPerPage = 10;

  const userRole = (role as 'admin' | 'employee') || 'employee';

  const loadHistories = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await fetchRedemptionHistoriesByRole(userRole, user.uid);
      setHistories(result);
    } catch {
      toast.error('Failed to load redemption history');
    }
    setLoading(false);
  }, [userRole, user]);

  useEffect(() => {
    if (user && role) {
      loadHistories();
    }
  }, [loadHistories, user, role]);

  const flatRows = histories.flatMap((item) =>
    item.histories.map((h) => ({
      itemTitle: item.title,
      userName: h.userName,
      code: h.code,
      claimedAt: h.claimedAt,
      redeemedAt: h.redeemedAt,
      redeemedBy: h.redeemedBy,
      status: h.status,
    }))
  );

  const filtered = flatRows.filter((row) => {
    const matchesTitle = row.itemTitle.toLowerCase().includes(filterTitle.toLowerCase());
    const matchesUser =
      userRole === 'admin' ? row.userName.toLowerCase().includes(filterUser.toLowerCase()) : true;

    const claimedAtDate = row.claimedAt?.toDate?.();
    const redeemedAtDate = row.redeemedAt?.toDate?.();

    const withinClaimedFrom = claimedFrom
      ? claimedAtDate && claimedAtDate >= new Date(claimedFrom)
      : true;
    const withinClaimedTo = claimedTo
      ? claimedAtDate && claimedAtDate <= new Date(claimedTo + 'T23:59:59')
      : true;

    const withinRedeemedFrom = redeemedFrom
      ? redeemedAtDate && redeemedAtDate >= new Date(redeemedFrom)
      : true;
    const withinRedeemedTo = redeemedTo
      ? redeemedAtDate && redeemedAtDate <= new Date(redeemedTo + 'T23:59:59')
      : true;

    const matchesStatus = filterStatus ? row.status === filterStatus : true;

    return (
      matchesTitle &&
      matchesUser &&
      matchesStatus &&
      withinClaimedFrom &&
      withinClaimedTo &&
      withinRedeemedFrom &&
      withinRedeemedTo
    );
  });

  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const formatDateTime = (ts?: Timestamp | null) => {
    return (
      ts?.toDate().toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }) ?? '-'
    );
  };

  function getStatusLabel(status: string): string {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  if (authLoading) {
    return (
      <Box sx={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body1">Loading session...</Typography>
      </Box>
    );
  }

  if (!user || !role) {
    return (
      <Box sx={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body1" color="error">
          You must be logged in to view this page.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 3, py: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h1" fontWeight={600}>
            Redemption History
          </Typography>
          <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ borderRadius: 2 }}>
            Redeem Code
          </Button>
        </Stack>

        <Paper variant="outlined" sx={{ p: 3, backgroundColor: 'white' }}>
          <Typography variant="h6" fontWeight={500} mb={2}>
            Filter Redemptions
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                label="Redemption Item Title"
                size="small"
                fullWidth
                value={filterTitle}
                onChange={(e) => setFilterTitle(e.target.value)}
              />
            </Grid>

            {userRole === 'admin' && (
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="User Name"
                  size="small"
                  fullWidth
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="fulfilled">Fulfilled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Claimed From"
                type="date"
                size="small"
                fullWidth
                value={claimedFrom}
                onChange={(e) => setClaimedFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Claimed To"
                type="date"
                size="small"
                fullWidth
                value={claimedTo}
                onChange={(e) => setClaimedTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Redeemed From"
                type="date"
                size="small"
                fullWidth
                value={redeemedFrom}
                onChange={(e) => setRedeemedFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Redeemed To"
                type="date"
                size="small"
                fullWidth
                value={redeemedTo}
                onChange={(e) => setRedeemedTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box>
                <Button
                  onClick={() => {
                    setFilterTitle('');
                    setFilterUser('');
                    setClaimedFrom('');
                    setClaimedTo('');
                    setRedeemedFrom('');
                    setRedeemedTo('');
                    setFilterStatus('');
                  }}
                  variant="outlined"
                  color="error"
                  sx={{ px: 3, borderRadius: 2 }}
                >
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper} variant="outlined">
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>No.</strong>
                </TableCell>
                <TableCell>
                  <strong>Item Title</strong>
                </TableCell>
                <TableCell>
                  <strong>User Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Code</strong>
                </TableCell>
                <TableCell>
                  <strong>Claimed At</strong>
                </TableCell>
                <TableCell>
                  <strong>Redeemed At</strong>
                </TableCell>
                <TableCell>
                  <strong>Redeemed By</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, idx) => (
                  <TableRow key={idx}>
                    {[...Array(userRole === 'admin' ? 9 : 8)].map((_, colIdx) => (
                      <TableCell key={colIdx}>
                        <Skeleton height={24} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginated.length > 0 ? (
                paginated.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{(page - 1) * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>{row.itemTitle}</TableCell>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{formatDateTime(row.claimedAt)}</TableCell>
                    <TableCell>{formatDateTime(row.redeemedAt)}</TableCell>
                    <TableCell>{row.redeemedBy || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={
                          row.status === 'fulfilled' ? (
                            <VerifiedIcon fontSize="small" />
                          ) : (
                            <AccessTimeIcon fontSize="small" />
                          )
                        }
                        label={getStatusLabel(row.status)}
                        color={row.status === 'fulfilled' ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={userRole === 'admin' ? 9 : 8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No matching redemption history found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row" justifyContent="flex-end" pt={4}>
          <Pagination
            count={Math.ceil(filtered.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            color="primary"
          />
        </Stack>
      </Box>

      <RedeemCodeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadHistories}
        userRole={userRole}
        currentUserId={user.uid}
        currentUserName={user.displayName || user.email || 'User'}
      />
    </>
  );
}
