'use client';

import { Tabs, Tab, Box } from '@mui/material';
import dynamic from 'next/dynamic';
import * as React from 'react';

import theme from '@/app/theme';

const ArSpotPanel = dynamic(() => import('./arSpots/ArSpotPanel'), {
  ssr: false,
});
const LocationModalWithGuide = dynamic(() => import('./arSpots/LocationModalWithGuide'), {
  ssr: false,
});

export default function InfoTabs() {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [selectedSpot, setSelectedSpot] = React.useState<{
    title: string;
    description: string;
    imageUrl: string;
    address?: string;
    collectibleTips?: string;
  } | null>(null);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: { xs: 'auto', lg: '100%' },
          maxHeight: { xs: 'unset', lg: '100%' },
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* Floating Tabs */}
        <Tabs
          value={tabIndex}
          onChange={(_, newIndex) => setTabIndex(newIndex)}
          variant="standard"
          slotProps={{
            indicator: {
              children: <span className="MuiIndicatorThumb" />,
              sx: {
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                height: '100%',
                zIndex: 0,
                '& .MuiIndicatorThumb': {
                  width: '100%',
                  backgroundColor: theme.palette.brand.main,
                  borderRadius: '9999px',
                  transition: 'all 0.3s ease',
                },
              },
            },
          }}
          sx={{
            position: 'absolute',
            top: '0px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            borderRadius: '9999px',
            backgroundColor: 'white',
            minHeight: '40px',
            padding: '6px',
            width: 'fit-content',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',

            '& .MuiTabs-flexContainer': {
              position: 'relative',
              zIndex: 1,
            },

            '& .MuiTab-root': {
              color: theme.palette.brand.main,
              fontWeight: 600,
              minHeight: '32px',
              minWidth: '100px',
              borderRadius: '9999px',
              zIndex: 2,
              transition: 'color 0.3s ease',
              textTransform: 'none',
              fontSize: '12px',
              letterSpacing: '0.5px',
              position: 'relative',
            },

            '& .Mui-selected': {
              color: '#ffffff !important',
            },

            '& .MuiTabs-indicator': {
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              height: '100%',
              zIndex: 0,
            },

            '& .MuiIndicatorThumb': {
              width: '100%',
              backgroundColor: theme.palette.brand.main,
              borderRadius: '9999px',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <Tab disableRipple label="AR SPOTS" />
        </Tabs>

        {/* Panel */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: 'white',
            borderRadius: 2,
            paddingTop: '52px', // Increased padding to account for tabs
            paddingX: '16px',
            paddingBottom: '16px',
            marginTop: '20px',
            boxShadow: 1,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            height: '100%',
            minHeight: 0,
          }}
        >
          <ArSpotPanel
            onSpotClick={(spotData) => {
              setSelectedSpot(spotData);
              setOpen(true);
            }}
          />
        </Box>
      </Box>

      {/* Location Modal */}
      {open && selectedSpot && (
        <LocationModalWithGuide open={open} onClose={() => setOpen(false)} spot={selectedSpot} />
      )}
    </>
  );
}
