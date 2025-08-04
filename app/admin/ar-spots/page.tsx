'use client';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ImageIcon from '@mui/icons-material/Image';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
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

import ARSpotModal from './ARSpotModal';
import { fetchArSpots, ArSpot, deleteARSpot } from './arSpotServices';
import { ARSpotFormInputs } from './arSpotValidation';

export default function AdminUserPage() {
  const [openModal, setOpenModal] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(1);
  const [editingSpot, setEditingSpot] = useState<ArSpot | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const rowsPerPage = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [arSpots, setArSpots] = useState<ArSpot[]>([]);
  const [loading, setLoading] = useState(true);

  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [id: string]: boolean }>({});
  const [expandedTips, setExpandedTips] = useState<{ [id: string]: boolean }>({});

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTip = (id: string) => {
    setExpandedTips((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  async function loadArSpots() {
    setLoading(true);
    try {
      const result = await fetchArSpots();
      setArSpots(result);
    } catch {
      toast.error('Failed to load AR spots');
    }
    setLoading(false);
  }

  useEffect(() => {
    loadArSpots();
  }, []);

  const filteredSpots = arSpots.filter((spot) =>
    spot.name.toLowerCase().includes(filterName.toLowerCase())
  );
  const paginatedSpots = filteredSpots.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleEdit = (spotId: string) => {
    const spot = arSpots.find((s) => s.id === spotId);
    if (spot) {
      setEditingSpot(spot);
      setMode('edit');
      setOpenModal(true);
    }
  };

  const handleCreate = () => {
    setEditingSpot(null);
    setMode('create');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingSpot(null);
  };

  const handleDelete = async (spotId: string, displayName: string) => {
    if (!confirm(`Are you sure you want to delete "${displayName}"?`)) return;

    try {
      await deleteARSpot(spotId);
      toast.success('AR Spot deleted successfully');
      await loadArSpots(); // refresh the list
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete AR spot';
      toast.error(message);
    }
  };

  // Convert ArSpot to ARSpotFormInputs format for editing
  const getInitialDataForEdit = (
    spot: ArSpot
  ): Partial<ARSpotFormInputs> & {
    id?: string;
    imgURL?: string;
    iconURL?: string;
    collectibleImageURL?: string;
  } => {
    return {
      id: spot.id,
      name: spot.name,
      description: spot.description,
      address: spot.address,
      arURL: spot.arURL,
      priority: spot.priority,
      coordinates: spot.coordinates,
      hasCollectible: !!spot.collectibleId,
      collectibleId: spot.collectibleId || '',
      imgURL: spot.imgURL,
      iconURL: spot.iconURL,
      collectibleImageURL: undefined,
    };
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
            AR Spots
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2 }}
            onClick={handleCreate}
          >
            Add AR Spot
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
            Filter Locations
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
          </Stack>
          <Stack direction="row" spacing={1} mt={3}>
            <Button
              variant="outlined"
              onClick={() => {
                setFilterName('');
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
                  <TableCell sx={{ width: '15%' }}>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell sx={{ width: '10px' }}>
                    <strong>Image</strong>
                  </TableCell>
                  <TableCell sx={{ width: '18%' }}>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell sx={{ width: '18%' }}>
                    <strong>Address</strong>
                  </TableCell>
                  <TableCell sx={{ width: '18%' }}>
                    <strong>Collectible</strong>
                  </TableCell>
                  <TableCell sx={{ width: '10px' }} align="center">
                    <strong>Priority</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Manage</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  Array.from({ length: rowsPerPage }).map((_, idx) => (
                    <TableRow key={idx}>
                      {[...Array(8)].map((_, colIdx) => (
                        <TableCell key={colIdx}>
                          <Skeleton height={24} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginatedSpots.length > 0 ? (
                  paginatedSpots.map((spot, index) => (
                    <TableRow
                      key={spot.id}
                      sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : 'white' }}
                    >
                      {/* No. with createdAt */}
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} mb={1}>
                          #{(page - 1) * rowsPerPage + index + 1}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {spot.createdAt || '-'}
                        </Typography>
                      </TableCell>

                      {/* Name with icon */}
                      <TableCell>
                        <Stack spacing={2}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1,
                                overflow: 'hidden',
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {spot.iconURL ? (
                                <img
                                  src={spot.iconURL}
                                  alt={`${spot.name} icon`}
                                  style={{
                                    width: 24,
                                    height: 24,
                                    objectFit: 'contain',
                                  }}
                                />
                              ) : (
                                <CircularProgress size={16} />
                              )}
                            </Box>

                            <Typography variant="body2" fontWeight={600}>
                              {spot.name}
                            </Typography>
                          </Stack>

                          {/* ID below the name */}
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <FingerprintIcon fontSize="small" sx={{ color: 'brand.main' }} />
                            <Typography variant="caption" color="text.secondary">
                              ID: {spot.id}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      {/* Image Tooltip */}
                      <TableCell align="center">
                        <Tooltip
                          placement="right"
                          title={
                            <Box
                              sx={{
                                bgcolor: 'white',
                                p: 1,
                                borderRadius: 1,
                                boxShadow: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 200,
                                minHeight: 100,
                              }}
                            >
                              {spot.imgURL ? (
                                <img
                                  src={spot.imgURL}
                                  alt={`${spot.name} preview`}
                                  style={{
                                    maxWidth: '100%',
                                    maxHeight: 120,
                                    objectFit: 'contain',
                                    borderRadius: 4,
                                  }}
                                />
                              ) : (
                                <CircularProgress size={24} />
                              )}
                            </Box>
                          }
                          arrow
                        >
                          <IconButton size="small">
                            <ImageIcon fontSize="small" sx={{ color: 'brand.main' }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                      {/* Description */}
                      <TableCell>
                        <Typography variant="caption" color="text.primary">
                          {expandedDescriptions[spot.id] || spot.description.length <= 100
                            ? spot.description
                            : `${spot.description.slice(0, 100)}... `}
                          {spot.description.length > 100 && (
                            <Button
                              onClick={() => toggleDescription(spot.id)}
                              size="small"
                              variant="text"
                              sx={{
                                textTransform: 'none',
                                minWidth: 0,
                                fontSize: '0.65rem',
                                ml: 0.5,
                              }}
                            >
                              {expandedDescriptions[spot.id] ? 'Show less' : 'Read more'}
                            </Button>
                          )}
                        </Typography>
                      </TableCell>

                      {/* Address with coordinates */}
                      <TableCell>
                        <Stack spacing={1}>
                          <Typography variant="caption" fontWeight="500">
                            {spot.address}
                          </Typography>

                          <Stack direction="row" spacing={1} alignItems="center">
                            <LocationOnIcon fontSize="small" sx={{ color: 'brand.main' }} />
                            <Typography variant="caption" color="text.secondary">
                              ({spot.coordinates.lat.toFixed(4)}, {spot.coordinates.lng.toFixed(4)})
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      {/* Collectible ID & Tips */}
                      <TableCell>
                        <Stack spacing={2}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <VerifiedIcon fontSize="small" sx={{ color: 'primary.main' }} />
                            <Typography variant="caption" fontWeight={'500'}>
                              {spot.collectibleId ? spot.collectibleId : 'None'}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <TipsAndUpdatesIcon fontSize="small" sx={{ color: 'brand.accent' }} />
                            <Typography variant="caption" color="text.secondary">
                              {spot.collectibleTips
                                ? expandedTips[spot.id] || spot.collectibleTips.length <= 70
                                  ? spot.collectibleTips
                                  : `${spot.collectibleTips.slice(0, 70)}... `
                                : 'N/A'}
                              {spot.collectibleTips && spot.collectibleTips.length > 70 && (
                                <Button
                                  onClick={() => toggleTip(spot.id)}
                                  size="small"
                                  variant="text"
                                  sx={{
                                    textTransform: 'none',
                                    minWidth: 0,
                                    fontSize: '0.65rem',
                                    ml: 0.5,
                                  }}
                                >
                                  {expandedTips[spot.id] ? 'Show less' : 'Read more'}
                                </Button>
                              )}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      {/* Priority */}
                      <TableCell align="center">
                        <Typography variant="body2">{spot.priority}</Typography>
                      </TableCell>

                      {/* Manage Buttons */}
                      <TableCell align="center">
                        <Stack direction="row" justifyContent="center" spacing={1}>
                          <IconButton onClick={() => handleEdit(spot.id)}>
                            <EditIcon sx={{ color: 'text.secondary' }} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(spot.id, spot.name)}>
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
                        No AR spots found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" justifyContent="flex-end" pt={4} pb={2}>
            <Pagination
              count={Math.ceil(filteredSpots.length / rowsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Stack>
        </Box>
      </Box>

      <ARSpotModal
        open={openModal}
        onClose={handleCloseModal}
        reloadSpots={loadArSpots}
        initialData={editingSpot ? getInitialDataForEdit(editingSpot) : undefined}
        mode={mode}
      />
    </>
  );
}
