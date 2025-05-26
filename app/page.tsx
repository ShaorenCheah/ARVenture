'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from './components/index/infoTabs';
import StepsModal from './components/index/stepsModal';
import { Card } from '@mui/material';

export default function Home() {
  const [openStepsModal, setOpenStepsModal] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => {
    setOpenStepsModal(true);
  }, 10);

  return () => clearTimeout(timer);
}, []);

  return (
    <Box
      component="main"
      sx={{
        width: '100%',
        height: {
          xs: 'calc(100vh - 40px - 40px - 56px)',
          sm: 'calc(100vh - 40px - 48px - 56px)',
          md: 'calc(100vh - 40px - 64px - 56px)',
          lg: 'calc(100vh - 48px - 64px - 64px)',
          xl: 'calc(100vh - 56px - 64px - 64px)',
        },
        display: 'flex',
        flexDirection: 'column',
        pb: { xs: 2.5, sm: 3, md: 4 },
      }}
    >
      <Grid
        container
        flexWrap="nowrap"
        flexDirection={{ xs: 'column', lg: 'row' }}
        spacing={{ xs: 2, md: 2.5 }}
        sx={{
          alignItems: 'start',
          height: '100%',
          flex: 1,
        }}
      >
        {/* Map Section */}
        <Grid
          size={{ xs: 12, lg: 6 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: {
              xs: 'auto',
              sm: '50%',
              lg: '100%',
            },
            aspectRatio: '1/1',
            flexShrink: { xs: 0, md: 1 },
          }}
        >
          <Card
            variant="outlined"
            sx={{
              width: { xs: '100%', sm: '40%', lg: '100%' },
              height: '100%',
              aspectRatio: '1/1',
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: 3,
              position: 'relative',
              backgroundColor: 'white',
            }}
          >
            <Box
              component="img"
              src="/map.png"
              alt="ARVenture Map"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          </Card>
        </Grid>

        {/* Info Section */}
        <Grid
          size={{ xs: 12, lg: 6 }}
          sx={{
            height: '100%',
            flex: { xs: 1, lg: 'unset' },
            minHeight: { xs: 0, lg: 'unset' },
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: { xs: 0, lg: 'unset' },
            }}
          >
            <Tabs />
          </Box>
        </Grid>
      </Grid>

      {/* Steps Modal */}
      <StepsModal open={openStepsModal} onClose={() => setOpenStepsModal(false)} />
    </Box>
  );
}
