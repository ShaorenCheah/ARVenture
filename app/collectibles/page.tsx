'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RedeemIcon from '@mui/icons-material/Redeem';
import {
  Box,
  Typography,
  Card,
  CircularProgress,
  Collapse,
  CardContent,
  Avatar,
  Chip,
  Skeleton,
  IconButton,
  InputAdornment,
  alpha,
  Divider,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import CollectibleSuccessModal from './CollectibleSuccessModal';
import {
  fetchAllCollectibles,
  Collectible as CollectibleType,
} from './services/collectiblesService';
import { redeemCollectibleWithLocation } from './services/redeemCollectibleService';
import { useUserModal } from '../components/providers/UserModalContext';

const SkeletonCard = styled(Card)(() => ({
  borderRadius: 16,
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  height: '280px',
  display: 'flex',
  flexDirection: 'column',
}));

const QuestionMarkAvatar = styled(Avatar)(() => ({
  width: 80,
  height: 80,
  backgroundColor: '#FFD700',
  color: '#FFA500',
  fontSize: '2rem',
  fontWeight: 'bold',
}));

const CollectedAvatar = styled(Box)(() => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  overflow: 'hidden',
  border: '3px solid #FFD700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
}));

interface Collectible extends CollectibleType {
  collected?: boolean;
  collectedDate?: string;
}

export default function CollectiblesPage() {
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Collectible[]>([]);
  const [userUid, setUserUid] = useState<string | null>(null);
  const { setOpenUserModal } = useUserModal();

  const [collapseOpen, setCollapseOpen] = useState(true);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<{
    imageURL: string;
    title: string;
    description: string;
  } | null>(null);

  const loadCollectibles = async (user: User | null) => {
    setIsLoading(true);

    const allCollectibles = await fetchAllCollectibles(user?.uid);
    setUserUid(user?.uid ?? null);
    setData(allCollectibles);
    setIsLoading(false);
  };

  const handleRedeem = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please log in to redeem your collectibles.');
      setOpenUserModal(true);
      return;
    }

    setSubmitting(true);

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await handleRedeemSubmit(code.trim(), position);
          setSubmitting(false);
          setCode('');
        },
        (_error) => {
          toast.error('Location access is required to redeem.');
          setSubmitting(false);
        },
        { enableHighAccuracy: true }
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to get location.');
      setSubmitting(false);
    }
  };

  // Reload collectibles when the success modal is closed
  useEffect(() => {
    if (!successModalOpen) {
      loadCollectibles(auth.currentUser);
    }
  }, [successModalOpen, auth.currentUser]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      loadCollectibles(user);
    });
    return () => unsubscribe();
  }, []);

  const handleRedeemSubmit = async (code: string, position: GeolocationPosition | null) => {
    if (!userUid) return;

    const result = await redeemCollectibleWithLocation(code, userUid, position);

    if (result.success && result.data) {
      toast.success(result.message);
      setSuccessData({
        imageURL: result.data.imageURL ?? '',
        title: result.data.title,
        description: `You've found ${result.data.description} at ${result.data.title}!`,
      });
      setSuccessModalOpen(true);
    } else {
      toast.error(result.message);
    }
  };

  const renderSkeletonCards = () => (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              py: 1,
              px: 2,
              flex: 1,
            }}
          >
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={20} />
          </CardContent>
        </SkeletonCard>
      ))}
    </>
  );

  const renderCollectibleCards = () => (
    <>
      {data.map((collectible) => (
        <Card
          key={collectible.id}
          sx={{
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 2,
            boxShadow: 'none',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              py: 3,
              px: 2,
              flex: 1,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.main', mb: 2 }}>
              {collectible.title}
            </Typography>

            {collectible.collected ? (
              <CollectedAvatar>
                <img
                  src={collectible.imageURL}
                  alt={collectible.description}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </CollectedAvatar>
            ) : (
              <QuestionMarkAvatar>
                <HelpOutlineIcon sx={{ fontSize: '60px', color: 'white' }} />
              </QuestionMarkAvatar>
            )}

            <Typography
              variant="h5"
              sx={{
                fontWeight: collectible.collected ? 'bold' : 'normal',
                color: collectible.collected ? '#FF4444' : '#999',
                mt: 2,
                mb: 0.5,
              }}
            >
              {collectible.collected ? collectible.description : '???'}
            </Typography>

            {collectible.collected ? (
              <Chip
                size="small"
                color="success"
                variant="outlined"
                sx={{ mt: 0.5 }}
                label={
                  collectible.collectedDate
                    ? `Collected on ${new Date(collectible.collectedDate).toLocaleDateString()}`
                    : 'Collection date unavailable'
                }
              />
            ) : (
              <Chip
                label="Not Collected"
                size="small"
                variant="outlined"
                sx={{
                  mt: 0.5,
                  color: 'brand.main',
                  borderColor: 'brand.main',
                }}
              />
            )}
          </Box>
        </Card>
      ))}
    </>
  );

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          maxHeight: '800px',
        }}
      >
        {/* Title */}
        <Box
          sx={{
            position: 'absolute',
            top: '-0px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            borderRadius: '9999px',
            backgroundColor: 'white',
            minHeight: '40px',
            p: '6px',
            width: 'fit-content',
            boxShadow: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              bgcolor: 'brand.main',
              borderRadius: '9999px',
              px: 2,
              py: 1,
              width: 'fit-content',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
              COLLECTIBLES
            </Typography>
          </Box>
        </Box>

        <Card
          sx={{
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
            paddingTop: '42px',
            paddingX: '16px',
            paddingBottom: '16px',
            marginTop: '20px',
            borderRadius: 2.5,
            boxShadow: 1,
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {/* Top Section*/}
          <Box mb={2}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: '500',
                  color: 'text.secondary',
                  textAlign: 'center',
                }}
              >
                {data.filter((c) => c.collected).length} out of {data.length} collected
              </Typography>

              {/* Collapse Button */}

              <IconButton
                onClick={() => setCollapseOpen(!collapseOpen)}
                sx={{
                  bgcolor: 'transparent',
                  width: 30,
                  height: 30,
                  transform: collapseOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': { bgcolor: alpha('#8E8E93', 0.2) },
                }}
              >
                <ExpandMoreIcon fontSize="small" />
              </IconButton>
            </Box>

            <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  textAlign: 'center',
                  mb: 1.5,
                }}
              >
                Redeem your collectibles with a unique code!
              </Typography>
              <TextField
                label="Enter collectible code"
                variant="outlined"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={submitting}
                size="small"
                slotProps={{
                  input: {
                    sx: {
                      py: 0, // vertical padding
                      pr: 2.5, // horizontal padding
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleRedeem}
                          color="error"
                          disabled={submitting || !code.trim()}
                          edge="end"
                          sx={{
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            ml: 1,
                          }}
                        >
                          {submitting ? (
                            <CircularProgress size={16} thickness={5} color="error" />
                          ) : (
                            <RedeemIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Card
                sx={{
                  p: 2,
                  gap: 0.5,
                  mt: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 1,
                  borderRadius: 2,
                }}
              >
                <Typography fontSize="0.725rem" sx={{ fontWeight: 'bold' }}>
                  Collectible Redemption Terms & Conditions
                </Typography>
                <Typography fontSize="0.688rem" color="text.secondary" ml={1}>
                  1. Collectible codes must be redeemed within the vicinity of the associated AR
                  spot.
                </Typography>
                <Typography fontSize="0.688rem" color="text.secondary" ml={1}>
                  2. Location access is required and will be used to verify proximity for
                  redemption.
                </Typography>
                <Typography fontSize="0.688rem" color="text.secondary" ml={1}>
                  2. Each collectible code is valid for a single redemption per user account.
                </Typography>
                <Typography fontSize="0.688rem" color="text.secondary" ml={1}>
                  3. Successfully redeemed collectibles may qualify for physical or digital gifts.
                </Typography>
                <Typography fontSize="0.688rem" color="text.secondary" ml={1}>
                  4. Rewards are subject to availability and offered on a first-come, first-served
                  basis.
                </Typography>
                <Typography fontSize="0.688rem" color="text.secondary">
                  By redeeming, you agree to these terms and consent to location tracking solely for
                  validation purposes.
                </Typography>
              </Card>

              <Divider sx={{ mb: 1, mt: 3 }} />
            </Collapse>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
              },
              gap: 2,
              minHeight: '100%',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {isLoading ? renderSkeletonCards() : renderCollectibleCards()}
          </Box>
        </Card>
      </Box>

      {successData && (
        <CollectibleSuccessModal
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          imageUrl={successData.imageURL}
          title={successData.title}
          description={successData.description}
        />
      )}
    </>
  );
}
