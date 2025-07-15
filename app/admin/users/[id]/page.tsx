'use client';

import {
  Box,
  Typography,
  Divider,
  Stack,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
} from '@mui/material';
import { getDoc, doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { fetchUserActivityData, UserActivityStats } from '../services/userActivityHistoryServices';

import { db } from '@/lib/firebase';

interface User {
  displayName: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

interface Column {
  key: string;
  label: string;
}

export default function UserDetailPage(): JSX.Element {
  const { slug } = useParams();
  const userId = slug as string;

  const [user, setUser] = useState<User | null>(null);
  const [activity, setActivity] = useState<UserActivityStats | null>(null);
  const [collected, setCollected] = useState<Record<string, unknown>[]>([]);
  const [redeemed, setRedeemed] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    async function loadData() {
      const userSnap = await getDoc(doc(db, 'users', userId));
      setUser(userSnap.exists() ? (userSnap.data() as User) : null);

      const { stats, collected, redeemed } = await fetchUserActivityData(userId);
      setActivity(stats);
      setCollected(
        collected
          .map((item) => ({ ...item }))
          .sort(
            (a, b) =>
              ((b.collectedAt as Date)?.getTime() || 0) - ((a.collectedAt as Date)?.getTime() || 0)
          )
      );
      setRedeemed(
        redeemed
          .map((item) => ({ ...item }))
          .sort(
            (a, b) =>
              ((b.redeemedAt as Date)?.getTime() || 0) - ((a.redeemedAt as Date)?.getTime() || 0)
          )
      );
    }

    if (userId) loadData();
  }, [userId]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        User Overview
      </Typography>

      {user ? (
        <>
          <Stack spacing={1} mb={4}>
            <Typography>
              <strong>Name:</strong> {user.displayName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography>
              <strong>Role:</strong> {user.role}
            </Typography>
            <Typography>
              <strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}
            </Typography>
            <Typography>
              <strong>Total Collected:</strong> {activity?.totalCollected ?? 0}
            </Typography>
            <Typography>
              <strong>Last Collected:</strong> {activity?.lastCollectedAt?.toLocaleString() ?? '-'}
            </Typography>
            <Typography>
              <strong>Total Redeemed:</strong> {activity?.totalRedeemed ?? 0}
            </Typography>
            <Typography>
              <strong>Last Redeemed:</strong> {activity?.lastRedeemedAt?.toLocaleString() ?? '-'}
            </Typography>
          </Stack>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Collected Items
          </Typography>
          <DataTable
            rows={collected}
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'arSpotName', label: 'AR Spot' },
              { key: 'redemptionCode', label: 'Code' },
              { key: 'collectedAt', label: 'Collected At' },
            ]}
          />

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Redeemed Items
          </Typography>
          <DataTable
            rows={redeemed}
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'couponCode', label: 'Coupon' },
              { key: 'collectibleTitle', label: 'Collectible' },
              { key: 'redeemedBy', label: 'Redeemed By' },
              { key: 'redeemedAt', label: 'Redeemed At' },
            ]}
          />
        </>
      ) : (
        <Typography>User not found.</Typography>
      )}
    </Box>
  );
}

function DataTable({
  rows,
  columns,
}: {
  rows: Record<string, unknown>[];
  columns: Column[];
}): JSX.Element {
  return (
    <Paper variant="outlined" sx={{ mt: 1, mb: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} sx={{ fontWeight: 600 }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                No data.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, i) => (
              <TableRow key={i}>
                {columns.map(({ key }) => (
                  <TableCell key={String(key)}>
                    {key.toString().includes('At') && row[key] instanceof Date
                      ? (row[key] as Date).toLocaleString()
                      : (row[key] as string) || '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
