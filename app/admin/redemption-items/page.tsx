'use client';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
  Pagination,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import RedemptionItemModal from './RedemptionItemModal';
import {
  RedemptionItem,
  fetchAllRedemptionItems,
  deleteRedemptionItem,
  expireRedemptionItem,
} from './redemptionItemServices';

export default function RedemptionItemAdminPage() {
  const [items, setItems] = useState<RedemptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editingItem, setEditingItem] = useState<RedemptionItem | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  async function loadItems() {
    setLoading(true);
    try {
      const result = await fetchAllRedemptionItems();
      setItems(result);
    } catch {
      toast.error('Failed to load redemption items');
    }
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  const filtered = items.filter((item) => item.title.toLowerCase().includes(filter.toLowerCase()));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleCreate = () => {
    setEditingItem(null);
    setMode('create');
    setModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setEditingItem(item);
      setMode('edit');
      setModalOpen(true);
    }
  };

  const handleExpire = async (id: string, title: string) => {
    if (!confirm(`Expire "${title}"? This action cannot be undone.`)) return;

    try {
      await expireRedemptionItem(id);
      toast.success(`"${title}" expired`);
      await loadItems();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to expire item';
      toast.error(message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteRedemptionItem(id);
      toast.success('Redemption item deleted');
      await loadItems();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete item';
      toast.error(message);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 3, py: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h1" fontWeight={600}>
            Redemption Items
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ borderRadius: 2 }}
          >
            Add Redemption Item
          </Button>
        </Stack>

        <Paper variant="outlined" sx={{ p: 3, backgroundColor: 'white' }}>
          <Typography variant="h6" fontWeight={500} mb={1}>
            Filter Items
          </Typography>
          <Stack
            spacing={isMobile ? 1 : 2}
            direction={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'stretch' : 'center'}
          >
            <TextField
              label="Search by Title"
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ width: { xs: '100%', md: '400px' } }}
            />
            <Button onClick={() => setFilter('')} variant="outlined" sx={{ borderRadius: 2 }}>
              Clear
            </Button>
          </Stack>
        </Paper>

        <TableContainer component={Paper} variant="outlined">
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '120px' }}>
                  <strong>No.</strong>
                </TableCell>
                <TableCell>
                  <strong>Title</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Image</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Priority</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Stock</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Required Spot</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Collectible ID</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Status</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, idx) => (
                  <TableRow key={idx}>
                    {[...Array(10)].map((_, colIdx) => (
                      <TableCell key={colIdx}>
                        <Skeleton height={24} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginated.length > 0 ? (
                paginated.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} mb={1}>
                        #{(page - 1) * rowsPerPage + index + 1}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.createdAt).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell align="center">
                      {item.resolvedImgURL ? (
                        <Tooltip
                          title={
                            <Box sx={{ p: 1 }}>
                              <img
                                src={item.resolvedImgURL}
                                alt={item.title}
                                style={{ maxHeight: 100, maxWidth: 150 }}
                              />
                            </Box>
                          }
                        >
                          <IconButton size="small">
                            <ImageIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <CircularProgress size={16} />
                      )}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell align="center">{item.priority}</TableCell>
                    <TableCell align="center">{item.stock}</TableCell>
                    <TableCell align="center">{item.requiredSpotName}</TableCell>
                    <TableCell align="center">{item.requiredCollectibleId}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.isExpired ? 'Expired' : 'Active'}
                        color={item.isExpired ? 'default' : 'success'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        {!item.isExpired && (
                          <>
                            <IconButton onClick={() => handleEdit(item.id)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleExpire(item.id, item.title)}>
                              <VisibilityOffIcon />
                            </IconButton>
                          </>
                        )}
                        <IconButton onClick={() => handleDelete(item.id, item.title)}>
                          <DeleteIcon sx={{ color: 'error.main' }} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No redemption items found.
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

      <RedemptionItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        reloadItems={loadItems}
        mode={mode}
        initialData={editingItem || undefined}
      />
    </>
  );
}
