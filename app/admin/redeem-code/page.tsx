'use client';

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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

import RedeemCodeModal from './RedeemCodeModal';
import { RedemptionItemRecord, fetchRedemptionHistoriesByRole } from './redemptionServices';

export default function RedemptionHistoryPage() {
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [histories, setHistories] = useState<RedemptionItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 10;

  const userRole: 'admin' | 'employee' = 'admin';
  const assignedCollectibleIds = useMemo(() => [], []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const loadHistories = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchRedemptionHistoriesByRole(userRole, assignedCollectibleIds);
      setHistories(result);
    } catch {
      toast.error('Failed to load redemption history');
    }
    setLoading(false);
  }, [userRole, assignedCollectibleIds]);

  useEffect(() => {
    loadHistories();
  }, [loadHistories]);

  const flatRows = histories.flatMap((item) =>
    item.histories.map((h) => ({
      itemTitle: item.title,
      userName: h.userName,
      code: h.code,
      claimedAt: h.claimedAt,
      redeemedAt: h.redeemedAt,
      status: h.status,
    }))
  );

  const filtered = flatRows.filter(
    (row) =>
      row.itemTitle.toLowerCase().includes(filterTitle.toLowerCase()) &&
      row.userName.toLowerCase().includes(filterUser.toLowerCase())
  );

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
          <Typography variant="h6" fontWeight={500} mb={1}>
            Filter Redemptions
          </Typography>
          <Stack
            spacing={isMobile ? 1 : 2}
            direction={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'stretch' : 'center'}
          >
            <TextField
              label="Redemption Item Title"
              size="small"
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
              sx={{ width: { xs: '100%', md: 300 } }}
            />
            <TextField
              label="User Name"
              size="small"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              sx={{ width: { xs: '100%', md: 300 } }}
            />
            <Button
              onClick={() => {
                setFilterTitle('');
                setFilterUser('');
              }}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Clear
            </Button>
          </Stack>
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
                  <strong>Status</strong>
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
              ) : paginated.length > 0 ? (
                paginated.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{(page - 1) * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>{row.itemTitle}</TableCell>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{formatDateTime(row.claimedAt)}</TableCell>
                    <TableCell>{formatDateTime(row.redeemedAt)}</TableCell>
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
                        label={row.status}
                        color={row.status === 'fulfilled' ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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
      />
    </>
  );
}
