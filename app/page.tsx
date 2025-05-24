import { Box, Card, Stack } from '@mui/material';
import Tabs from './components/Index/infoTabs';

export default function Home() {
  return (
    <Stack component="main">
      {/* Map Section */}
      <Box
        component="img"
        src="/map.png"
        alt="ARVenture Map"
        sx={{
          width: '100%',
          height: '340px',
          borderRadius: '8px',
          mb: 2,
        }}
      />

      {/* Info Section */}
      <Tabs />
    </Stack>
  );
}
