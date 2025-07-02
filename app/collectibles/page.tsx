'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Chip, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  fetchAllCollectibles,
  Collectible as CollectibleType,
} from './services/collectiblesService';
import { useUserModal } from '../components/providers/UserModalContext';
import RedeemCollectibleModal from './redeemCollectibleModal';
import { redeemCollectibleWithLocation } from './services/redeemCollectibleService';
import toast from 'react-hot-toast';

const CollectibleCard = styled(Card)(({ theme }) => ({
  borderRadius: 2,
  backgroundColor: '#ffffff',

  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',

  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease',
  },
}));

const SkeletonCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  height: '280px',
  display: 'flex',
  flexDirection: 'column',
}));

const QuestionMarkAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: '#FFD700',
  color: '#FFA500',
  fontSize: '2rem',
  fontWeight: 'bold',
  margin: '0 auto 16px auto',
}));

const CollectedAvatar = styled(Box)(({ theme }) => ({
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

const RedeemChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#FF4444',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '0.75rem',
  height: 24,
  cursor: 'pointer',
  '& .MuiChip-label': {
    paddingX: 1,
  },
}));

interface Collectible extends CollectibleType {
  collected?: boolean;
  collectedDate?: string;
}

export default function CollectiblesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Collectible[]>([]);
  const [userUid, setUserUid] = useState<string | null>(null);
  const { setOpenUserModal } = useUserModal();
  const [redeemOpen, setRedeemOpen] = useState(false);

  const loadCollectibles = async (user: any) => {
    setIsLoading(true);

    const allCollectibles = await fetchAllCollectibles(user?.uid);
    setUserUid(user?.uid ?? null);
    setData(allCollectibles);
    setIsLoading(false);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      loadCollectibles(user);
    });
    return () => unsubscribe();
  }, []);

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
              py: 3,
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
        <CollectibleCard key={collectible.id}>
          <CardContent
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
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
                <HelpOutlineIcon fontSize="large" />
              </QuestionMarkAvatar>
            )}

            <Typography
              variant="body1"
              sx={{
                fontWeight: collectible.collected ? 'bold' : 'normal',
                color: collectible.collected ? '#FF4444' : '#999',
                my: 1,
              }}
            >
              {collectible.collected ? collectible.description : '???'}
            </Typography>

            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
              {collectible.collected
                ? collectible.collectedDate
                  ? `Collected on ${new Date(collectible.collectedDate).toLocaleDateString()}`
                  : 'Collected date invalid'
                : 'Not Collected'}
            </Typography>
          </CardContent>
        </CollectibleCard>
      ))}
    </>
  );

  const handleRedeemClick = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please log in to redeem your collectibles.');
      setOpenUserModal(true);
    } else {
      setRedeemOpen(true);
    }
  };

  const handleRedeemSubmit = async (code: string, position: GeolocationPosition | null) => {
    if (!userUid) return;
    const result = await redeemCollectibleWithLocation(code, userUid, position);
    if (result.success) {
      toast.success(result.message);
      const auth = getAuth();
      loadCollectibles(auth.currentUser);
    } else {
      toast.error(result.message);
    }
    setRedeemOpen(false);
  };
  return (
    <>
      <Card sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
            Your Collectibles
          </Typography>
          <RedeemChip label="REDEEM" onClick={handleRedeemClick} />
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
            gap: 3,
            maxHeight: '550px',
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
      <RedeemCollectibleModal
        open={redeemOpen}
        onClose={() => setRedeemOpen(false)}
        onSubmit={handleRedeemSubmit}
      />
    </>
  );
}
