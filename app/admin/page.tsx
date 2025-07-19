'use client';

import { fetchArSpots } from '@admin/ar-spots/arSpotServices';
import { fetchAllCollectibles } from '@admin/collectibles/collectibleServices';
import {
  RedemptionItemRecord,
  fetchRedemptionHistoriesByRole,
} from '@admin/redeem-code/redemptionServices';
import { fetchAllRedemptionItems } from '@admin/redemption-items/redemptionItemServices';
import { fetchUsers } from '@admin/users/services/userServices';
import { useAuth } from '@auth/AuthContext';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Pagination,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type AdminStats = {
  totalUsers: number;
  totalSpots: number;
  totalCollectibles: number;
  totalItems: number;
  todaysRedemptions: number;
};
type EmployeeStats = {
  assignedSpot: string;
  todaysRedemptions: number;
};
type DashboardStats = AdminStats | EmployeeStats;

export default function DashboardPage() {
  const rowsPerPage = 10;
  const { user, role, delegatedSpotName, loading: authLoading } = useAuth();

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [historyData, setHistoryData] = useState<RedemptionItemRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdminStats = (stats: DashboardStats): stats is AdminStats => 'totalUsers' in stats;

  useEffect(() => {
    async function loadDashboard() {
      if (!user || !role) return;

      const histories = await fetchRedemptionHistoriesByRole(
        role as 'admin' | 'employee',
        user.uid
      );
      setHistoryData(histories);

      const todaysRedemptions = histories
        .flatMap((item) => item.histories)
        .filter(
          (h) =>
            h.status === 'fulfilled' &&
            h.redeemedAt?.toDate().toDateString() === new Date().toDateString()
        ).length;

      if (role === 'admin') {
        const [users, arSpots, collectibles, redemptionItems] = await Promise.all([
          fetchUsers(),
          fetchArSpots(),
          fetchAllCollectibles(),
          fetchAllRedemptionItems(),
        ]);

        setStats({
          totalUsers: users.length,
          totalSpots: arSpots.length,
          totalCollectibles: collectibles.length,
          totalItems: redemptionItems.length,
          todaysRedemptions,
        });
      } else {
        setStats({
          assignedSpot: delegatedSpotName || 'Not Assigned',
          todaysRedemptions,
        });
      }

      setLoading(false);
    }

    if (!authLoading) {
      loadDashboard();
    }
  }, [authLoading, user, role, delegatedSpotName]);

  const formatDateTime = (ts?: Timestamp | null): string =>
    ts?.toDate().toLocaleString('en-MY', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }) ?? '-';

  const getStatusLabel = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

  const renderCard = (label: string, value: string | number, color: string) => (
    <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
      <Card sx={{ backgroundColor: `${color}.main`, color: 'white' }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="caption">
            As of{' '}
            {new Date().toLocaleDateString('en-MY', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const now = new Date();
  const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // shift to Monday
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() + offset);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const rows = historyData.flatMap((item) =>
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

  const filteredRows = rows.filter((r) => {
    const date = r.redeemedAt?.toDate?.();
    if (!date) return false;

    if (tab === 0) return date.toDateString() === now.toDateString(); // Today
    if (tab === 1) return date >= startOfWeek && date <= now; // This Week
    return date >= startOfMonth && date <= now; // This Month
  });

  const paginated = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box px={3} py={4}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Admin Dashboard
      </Typography>

      {stats && (
        <Grid container spacing={3} mb={4}>
          {isAdminStats(stats) ? (
            <>
              {renderCard('Total Users', stats.totalUsers, 'info')}
              {renderCard('AR Spots', stats.totalSpots, 'secondary')}
              {renderCard('Collectibles', stats.totalCollectibles, 'success')}
              {renderCard('Redemption Items', stats.totalItems, 'warning')}
              {renderCard("Today's Redemptions", stats.todaysRedemptions, 'error')}
            </>
          ) : (
            <>
              {renderCard('Assigned Spot', stats.assignedSpot, 'secondary')}
              {renderCard("Today's Redemptions", stats.todaysRedemptions, 'primary')}
            </>
          )}
        </Grid>
      )}

      <Typography variant="h4" fontWeight="bold" mt={3} mb={2}>
        Redemptions
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, v) => {
          setTab(v);
          setPage(1);
        }}
        sx={{ mb: 2 }}
      >
        <Tab label="Today" />
        <Tab label="This Week" />
        <Tab label="This Month" />
      </Tabs>

      <Paper variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>No.</strong>
                </TableCell>
                <TableCell>
                  <strong>Item</strong>
                </TableCell>
                <TableCell>
                  <strong>User</strong>
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
              {paginated.length > 0 ? (
                paginated.map((row, index) => (
                  <TableRow key={`${row.code}_${index}`}>
                    <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
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
                  <TableCell colSpan={role === 'admin' ? 9 : 8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No redemptions found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row" justifyContent="flex-end" p={2}>
          <Pagination
            count={Math.ceil(filteredRows.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            color="primary"
          />
        </Stack>
      </Paper>
    </Box>
  );
}
