// page.tsx
'use client';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ImageIcon from '@mui/icons-material/Image';
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
  useMediaQuery,
  useTheme,
  Skeleton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import CollectibleModal from './CollectibleModal';
import {
  fetchAllCollectibles,
  deleteCollectible,
  CollectibleWithARSpot,
} from './collectibleServices';

export default function AdminCollectiblePage() {
  const [openModal, setOpenModal] = useState(false);
  const [filterTitle, setFilterTitle] = useState('');
  const [page, setPage] = useState(1);
  const [editingCollectible, setEditingCollectible] = useState<CollectibleWithARSpot | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const rowsPerPage = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [collectibles, setCollectibles] = useState<CollectibleWithARSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTips, setExpandedTips] = useState<{ [id: string]: boolean }>({});

  const toggleTip = (id: string) => {
    setExpandedTips((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  async function loadCollectibles() {
    setLoading(true);
    try {
      const result = await fetchAllCollectibles();
      setCollectibles(result);
    } catch {
      toast.error('Failed to load collectibles');
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCollectibles();
  }, []);

  const filtered = collectibles.filter((item) =>
    item.title.toLowerCase().includes(filterTitle.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleEdit = (id: string) => {
    const item = collectibles.find((c) => c.id === id);
    if (item) {
      setEditingCollectible(item);
      setMode('edit');
      setOpenModal(true);
    }
  };

  const handleCreate = () => {
    setEditingCollectible(null);
    setMode('create');
    setOpenModal(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteCollectible(id);
      toast.success('Collectible deleted');
      await loadCollectibles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete collectible';
      toast.error(message);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 3, py: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h1" fontWeight={600}>
            Collectibles
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ borderRadius: 2 }}
          >
            Add Collectible
          </Button>
        </Stack>

        <Paper variant="outlined" sx={{ p: 3, backgroundColor: 'white' }}>
          <Typography variant="h6" fontWeight={500} mb={1}>
            Filter Collectibles
          </Typography>
          <Stack
            spacing={isMobile ? 1 : 2}
            direction={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'stretch' : 'center'}
          >
            <TextField
              label="Search by Title"
              size="small"
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
              sx={{ width: { xs: '100%', md: '400px' } }}
            />
            <Button onClick={() => setFilterTitle('')} variant="outlined" sx={{ borderRadius: 2 }}>
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
                  <strong>Title</strong>
                </TableCell>
                <TableCell>
                  <strong>Image</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Redemption Code</strong>
                </TableCell>
                <TableCell>
                  <strong>Tips</strong>
                </TableCell>
                <TableCell>
                  <strong>Priority</strong>
                </TableCell>
                <TableCell>
                  <strong>AR Spot</strong>
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
                    {[...Array(9)].map((_, colIdx) => (
                      <TableCell key={colIdx}>
                        <Skeleton height={24} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginated.length > 0 ? (
                paginated.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmojiEventsIcon fontSize="small" />
                        <Typography variant="body2" fontWeight={600}>
                          {item.title}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <FingerprintIcon fontSize="small" sx={{ color: 'brand.main' }} />
                        <Typography variant="caption" color="text.secondary">
                          ID: {item.id}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      {item.imageURL ? (
                        <Tooltip
                          title={
                            <Box sx={{ p: 1 }}>
                              <img
                                src={item.imageURL}
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
                    <TableCell>
                      <Typography variant="body2">{item.description}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{item.redemptionCode}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {expandedTips[item.id] || item.tips.length <= 70
                          ? item.tips
                          : `${item.tips.slice(0, 70)}... `}
                        {item.tips.length > 70 && (
                          <Button
                            onClick={() => toggleTip(item.id)}
                            size="small"
                            sx={{ fontSize: '0.65rem', ml: 0.5 }}
                          >
                            {expandedTips[item.id] ? 'Show less' : 'Read more'}
                          </Button>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{item.priority}</TableCell>
                    <TableCell>{item.arSpotName || '-'}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton onClick={() => handleEdit(item.id)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.id, item.title)}>
                          <DeleteIcon sx={{ color: 'error.main' }} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No collectibles found.
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

      <CollectibleModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        mode={mode}
        initialData={editingCollectible || undefined}
        reloadCollectibles={loadCollectibles}
      />
    </>
  );
}
