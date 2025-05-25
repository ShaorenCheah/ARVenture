import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from './components/Index/infoTabs';

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: {
            xs: 'calc(100vh - 72px - 56px)',
            md: 'calc(100vh - 72px - 64px)',
          },
          pb: 2.5,
        }}
      >
        {/* Map Section */}
        <Grid size={{ xs: 12, md: 5, lg: 5 }}>
          <Box
            sx={{
              width: '100%',
              aspectRatio: '1 / 1', // Keep the square aspect ratio
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
          </Box>
        </Grid>

        {/* Info Section */}
        <Grid size={{ xs: 12, md: 7, lg: 7 }}>
          <Box
            sx={{
              width: '100%',
              height: '100%', // Take full height of grid item
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Tabs />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
