'use client';

// import {
//   People as PeopleIcon,
//   Redeem as RedeemIcon,
//   Store as StoreIcon,
//   SportsEsports as SportsIcon,
//   CollectionsBookmark as CollectiblesIcon,
//   Person as PersonIcon,
//   TrendingUp as TrendingUpIcon,
//   Warning as WarningIcon,
//   CheckCircle as CheckCircleIcon,
//   MoreVert,
//   Notifications,
//   Settings,
// } from '@mui/icons-material';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Chip,
//   Button,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Avatar,
//   Divider,
//   IconButton,
//   Menu,
//   MenuItem,
// } from '@mui/material';
// import React, { useState } from 'react';

// // Mock data for dashboard
// const mockStats = {
//   totalUsers: 1247,
//   activeArSpots: 23,
//   totalCollectibles: 156,
//   redemptionItems: 42,
//   todayRedemptions: 18,
//   weeklyGrowth: 12.5,
//   merchantStores: 8,
//   pendingReviews: 3,
// };

// const mockRecentActivity = [
//   {
//     id: 1,
//     user: 'John Doe',
//     action: 'Collected AR item',
//     location: 'Sunway Pyramid',
//     time: '2 min ago',
//     type: 'collect',
//   },
//   {
//     id: 2,
//     user: 'Jane Smith',
//     action: 'Redeemed voucher',
//     location: 'Sunway Lagoon',
//     time: '5 min ago',
//     type: 'redeem',
//   },
//   {
//     id: 3,
//     user: 'Mike Johnson',
//     action: 'Discovered new AR spot',
//     location: 'Sunway University',
//     time: '12 min ago',
//     type: 'discover',
//   },
//   {
//     id: 4,
//     user: 'Sarah Wilson',
//     action: 'Completed collection',
//     location: 'Sunway Medical Centre',
//     time: '18 min ago',
//     type: 'complete',
//   },
//   {
//     id: 5,
//     user: 'David Chen',
//     action: 'Registered new account',
//     location: 'Sunway Geo',
//     time: '25 min ago',
//     type: 'register',
//   },
// ];

// const mockMerchantStats = {
//   totalSales: 2450,
//   activeVouchers: 15,
//   redemptionsToday: 8,
//   storeViews: 342,
// };

// interface AdminDashboardProps {
//   role?: string;
// }

// export default function AdminDashboard({ role }: AdminDashboardProps) {
export default function AdminDashboard() {
  //   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  //   const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  //   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  //     setAnchorEl(event.currentTarget);
  //   };

  //   const handleMenuClose = () => {
  //     setAnchorEl(null);
  //   };

  //   const getActivityIcon = (type: string) => {
  //     switch (type) {
  //       case 'collect':
  //         return <CollectiblesIcon sx={{ color: 'primary.main' }} />;
  //       case 'redeem':
  //         return <RedeemIcon sx={{ color: 'success.main' }} />;
  //       case 'discover':
  //         return <SportsIcon sx={{ color: 'secondary.main' }} />;
  //       case 'complete':
  //         return <CheckCircleIcon sx={{ color: 'success.main' }} />;
  //       case 'register':
  //         return <PersonIcon sx={{ color: 'info.main' }} />;
  //       default:
  //         return <PersonIcon />;
  //     }
  //   };

  //   const renderAdminStats = () => (
  //     <Grid container spacing={3} sx={{ mb: 4 }}>
  //       <Grid size={{ xs: 12, sm: 6, md: 3 }}>
  //         <Card
  //           sx={{
  //             background: 'linear-gradient(135deg, #ED1D24 0%, #c70e14 100%)',
  //             color: 'white',
  //             transition: 'transform 0.2s ease-in-out',
  //             '&:hover': { transform: 'translateY(-4px)' },
  //           }}
  //         >
  //           <CardContent>
  //             <Box display="flex" alignItems="center" justifyContent="space-between">
  //               <Box>
  //                 <Typography variant="h3" fontWeight="bold">
  //                   {mockStats.totalUsers.toLocaleString()}
  //                 </Typography>
  //                 <Typography variant="body2" sx={{ opacity: 0.9 }}>
  //                   Total Users
  //                 </Typography>
  //               </Box>
  //               <PeopleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
  //             </Box>
  //             <Box mt={2}>
  //               <Typography variant="caption" sx={{ opacity: 0.8 }}>
  //                 +12% from last week
  //               </Typography>
  //             </Box>
  //           </CardContent>
  //         </Card>
  //       </Grid>

  //       <Grid size={{ xs: 12, sm: 6, md: 3 }}>
  //         <Card
  //           sx={{
  //             background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
  //             color: 'white',
  //             transition: 'transform 0.2s ease-in-out',
  //             '&:hover': { transform: 'translateY(-4px)' },
  //           }}
  //         >
  //           <CardContent>
  //             <Box display="flex" alignItems="center" justifyContent="space-between">
  //               <Box>
  //                 <Typography variant="h3" fontWeight="bold">
  //                   {mockStats.activeArSpots}
  //                 </Typography>
  //                 <Typography variant="body2" sx={{ opacity: 0.9 }}>
  //                   Active AR Spots
  //                 </Typography>
  //               </Box>
  //               <SportsIcon sx={{ fontSize: 48, opacity: 0.8 }} />
  //             </Box>
  //             <Box mt={2}>
  //               <Typography variant="caption" sx={{ opacity: 0.8 }}>
  //                 Across Bandar Sunway
  //               </Typography>
  //             </Box>
  //           </CardContent>
  //         </Card>
  //       </Grid>

  //       <Grid size={{ xs: 12, sm: 6, md: 3 }}>
  //         <Card
  //           sx={{
  //             background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
  //             color: 'white',
  //             transition: 'transform 0.2s ease-in-out',
  //             '&:hover': { transform: 'translateY(-4px)' },
  //           }}
  //         >
  //           <CardContent>
  //             <Box display="flex" alignItems="center" justifyContent="space-between">
  //               <Box>
  //                 <Typography variant="h3" fontWeight="bold">
  //                   {mockStats.totalCollectibles}
  //                 </Typography>
  //                 <Typography variant="body2" sx={{ opacity: 0.9 }}>
  //                   Total Collectibles
  //                 </Typography>
  //               </Box>
  //               <CollectiblesIcon sx={{ fontSize: 48, opacity: 0.8 }} />
  //             </Box>
  //             <Box mt={2}>
  //               <Typography variant="caption" sx={{ opacity: 0.8 }}>
  //                 Available for discovery
  //               </Typography>
  //             </Box>
  //           </CardContent>
  //         </Card>
  //       </Grid>

  //       <Grid size={{ xs: 12, sm: 6, md: 3 }}>
  //         <Card
  //           sx={{
  //             background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
  //             color: 'white',
  //             transition: 'transform 0.2s ease-in-out',
  //             '&:hover': { transform: 'translateY(-4px)' },
  //           }}
  //         >
  //           <CardContent>
  //             <Box display="flex" alignItems="center" justifyContent="space-between">
  //               <Box>
  //                 <Typography variant="h3" fontWeight="bold">
  //                   {mockStats.todayRedemptions}
  //                 </Typography>
  //                 <Typography variant="body2" sx={{ opacity: 0.9 }}>
  //                   Today&apos;s Redemptions
  //                 </Typography>
  //               </Box>
  //               <RedeemIcon sx={{ fontSize: 48, opacity: 0.8 }} />
  //             </Box>
  //             <Box mt={2}>
  //               <Typography variant="caption" sx={{ opacity: 0.8 }}>
  //                 +5 from yesterday
  //               </Typography>
  //             </Box>
  //           </CardContent>
  //         </Card>
  //       </Grid>
  //     </Grid>
  //   );

  //   const renderMerchantStats = () => (
  //     <Grid container spacing={3} sx={{ mb: 4 }}>
  //       <Grid size={{ xs: 12, sm: 6, md: 3 }}>
  //         <Card
  //           sx={{
  //             background: 'linear-gradient(135deg, #ED1D24 0%, #c70e14 100%)',
  //             color: 'white',
  //             transition: 'transform 0.2s ease-in-out',
  //             '&:hover': { transform: 'translateY(-4px)' },
  //           }}
  //         >
  //           <CardContent>
  //             <Box display="flex" alignItems="center" justifyContent="space-between">
  //               <Box>
  //                 <Typography variant="h3" fontWeight="bold">
  //                   RM {mockMerchantStats.totalSales.toLocaleString()}
  //                 </Typography>
  //                 <Typography variant="body2" sx={{ opacity: 0.9 }}>
  //                   Total Sales
  //                 </Typography>
  //               </Box>
  //               <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.8 }} />
  //             </Box>
  //           </CardContent>
  //         </Card>
  //       </Grid>

  //       <Grid size={{ xs: 12, sm: 6, md: 3 }}>
  //         <Card
  //           sx={{
  //             background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
  //             color: 'white',
  //             transition: 'transform 0.2s ease-in-out',
  //             '&:hover': { transform: 'translateY(-4px)' },
  //           }}
  //         >
  //           <CardContent>
  //             <Box display="flex" alignItems="center" justifyContent="space-between">
  //               <Box>
  //                 <Typography variant="h3" fontWeight="bold">
  //                   {mockMerchantStats.activeVouchers}
  //                 </Typography>
  //                 <Typography variant="body2" sx={{ opacity: 0.9 }}>
  //                   Active Vouchers
  //                 </Typography>
  //               </Box>
  //               <RedeemIcon sx={{ fontSize: 48, opacity: 0.8 }} />
  //             </Box>
  //           </CardContent>
  //         </Card>
  //       </Grid>

  //       <Grid size={{ xs: 12, sm: 6, md: 3 }}>
  //         <Card
  //           sx={{
  //             background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
  //             color: 'white',
  //             transition: 'transform 0.2s ease-in-out',
  //             '&:hover': { transform: 'translateY(-4px)' },
  //           }}
  //         >
  //           <CardContent>
  //             <Box display="flex" alignItems="center" justifyContent="space-between">
  //               <Box>
  //                 <Typography variant="h3" fontWeight="bold">
  //                   {mockMerchantStats.redemptionsToday}
  //                 </Typography>
  //                 <Typography variant="body2" sx={{ opacity: 0.9 }}>
  //                   Today&apos;s Redemptions
  //                 </Typography>
  //               </Box>
  //               <CheckCircleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
  //             </Box>
  //           </CardContent>
  //         </Card>
  //       </Grid>

  //       <Grid size={{ xs: 12, sm: 6, md: 3 }}>
  //         <Card
  //           sx={{
  //             background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
  //             color: 'white',
  //             transition: 'transform 0.2s ease-in-out',
  //             '&:hover': { transform: 'translateY(-4px)' },
  //           }}
  //         >
  //           <CardContent>
  //             <Box display="flex" alignItems="center" justifyContent="space-between">
  //               <Box>
  //                 <Typography variant="h3" fontWeight="bold">
  //                   {mockMerchantStats.storeViews}
  //                 </Typography>
  //                 <Typography variant="body2" sx={{ opacity: 0.9 }}>
  //                   Store Views
  //                 </Typography>
  //               </Box>
  //               <StoreIcon sx={{ fontSize: 48, opacity: 0.8 }} />
  //             </Box>
  //           </CardContent>
  //         </Card>
  //       </Grid>
  //     </Grid>
  //   );

  //   const welcomeText =
  //     role === 'admin'
  //       ? 'Welcome, Admin! You have full access to manage users, vouchers, and content.'
  //       : role === 'merchant'
  //         ? 'Welcome, Merchant! You can manage your store and vouchers here.'
  //         : 'Welcome!';

  return (
    //     <Box>
    //       {/* Header Section */}
    //       <Box sx={{ mb: 4 }}>
    //         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    //           <Box>
    //             <Typography variant="h2" fontWeight="bold" sx={{ color: 'brand.main' }}>
    //               ARVenture Dashboard
    //             </Typography>
    //             <Typography variant="h6" sx={{ color: 'text.secondary', mt: 1 }}>
    //               {welcomeText}
    //             </Typography>
    //           </Box>
    //           <Box display="flex" alignItems="center" gap={1}>
    //             <Button
    //               variant={selectedTimeRange === '7d' ? 'contained' : 'outlined'}
    //               size="small"
    //               onClick={() => setSelectedTimeRange('7d')}
    //             >
    //               7 Days
    //             </Button>
    //             <Button
    //               variant={selectedTimeRange === '30d' ? 'contained' : 'outlined'}
    //               size="small"
    //               onClick={() => setSelectedTimeRange('30d')}
    //             >
    //               30 Days
    //             </Button>
    //             <IconButton onClick={handleMenuOpen}>
    //               <MoreVert />
    //             </IconButton>
    //           </Box>
    //         </Box>
    //       </Box>

    //       {/* Stats Cards */}
    //       {role === 'admin' ? renderAdminStats() : renderMerchantStats()}

    //       {/* Content Grid */}
    //       <Grid container spacing={3}>
    //         {/* Recent Activity */}
    //         <Grid size={{ xs: 12, md: 8 }}>
    //           <Card sx={{ height: '100%' }}>
    //             <CardContent>
    //               <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    //                 <Typography variant="h5" fontWeight="bold" sx={{ color: 'brand.main' }}>
    //                   Recent Activity
    //                 </Typography>
    //                 <Button size="small" variant="text">
    //                   View All
    //                 </Button>
    //               </Box>
    //               <List>
    //                 {mockRecentActivity.map((activity, index) => (
    //                   <React.Fragment key={activity.id}>
    //                     <ListItem sx={{ px: 0 }}>
    //                       <ListItemIcon>
    //                         <Avatar sx={{ bgcolor: 'brand.light', width: 40, height: 40 }}>
    //                           {getActivityIcon(activity.type)}
    //                         </Avatar>
    //                       </ListItemIcon>
    //                       <ListItemText
    //                         primary={
    //                           <Box display="flex" alignItems="center" gap={1}>
    //                             <Typography variant="body1" fontWeight="600">
    //                               {activity.user}
    //                             </Typography>
    //                             <Typography variant="body1" color="text.secondary">
    //                               {activity.action}
    //                             </Typography>
    //                           </Box>
    //                         }
    //                         secondary={
    //                           <Box display="flex" alignItems="center" gap={1} mt={0.5}>
    //                             <Typography variant="body2" color="text.secondary">
    //                               {activity.location}
    //                             </Typography>
    //                             <Typography variant="body2" sx={{ color: 'brand.main' }}>
    //                               • {activity.time}
    //                             </Typography>
    //                           </Box>
    //                         }
    //                       />
    //                     </ListItem>
    //                     {index < mockRecentActivity.length - 1 && <Divider />}
    //                   </React.Fragment>
    //                 ))}
    //               </List>
    //             </CardContent>
    //           </Card>
    //         </Grid>

    //         {/* Quick Stats & Actions */}
    //         <Grid size={{ xs: 12, md: 4 }}>
    //           <Grid container spacing={3}>
    //             {/* System Health */}
    //             <Grid size={{ xs: 12 }}>
    //               <Card>
    //                 <CardContent>
    //                   <Typography
    //                     variant="h6"
    //                     fontWeight="bold"
    //                     gutterBottom
    //                     sx={{ color: 'brand.main' }}
    //                   >
    //                     System Health
    //                   </Typography>
    //                   <Box display="flex" flexDirection="column" gap={2}>
    //                     <Box display="flex" alignItems="center" justifyContent="space-between">
    //                       <Typography variant="body2">Server Status</Typography>
    //                       <Chip
    //                         label="Online"
    //                         color="success"
    //                         size="small"
    //                         icon={<CheckCircleIcon />}
    //                       />
    //                     </Box>
    //                     <Box display="flex" alignItems="center" justifyContent="space-between">
    //                       <Typography variant="body2">Database</Typography>
    //                       <Chip
    //                         label="Healthy"
    //                         color="success"
    //                         size="small"
    //                         icon={<CheckCircleIcon />}
    //                       />
    //                     </Box>
    //                     <Box display="flex" alignItems="center" justifyContent="space-between">
    //                       <Typography variant="body2">API Response</Typography>
    //                       <Typography variant="body2" fontWeight="bold" color="success.main">
    //                         45ms
    //                       </Typography>
    //                     </Box>
    //                     {role === 'admin' && (
    //                       <Box display="flex" alignItems="center" justifyContent="space-between">
    //                         <Typography variant="body2">Pending Reviews</Typography>
    //                         <Chip
    //                           label={mockStats.pendingReviews}
    //                           color="warning"
    //                           size="small"
    //                           icon={<WarningIcon />}
    //                         />
    //                       </Box>
    //                     )}
    //                   </Box>
    //                 </CardContent>
    //               </Card>
    //             </Grid>

    //             {/* Quick Actions */}
    //             <Grid size={{ xs: 12 }}>
    //               <Card>
    //                 <CardContent>
    //                   <Typography
    //                     variant="h6"
    //                     fontWeight="bold"
    //                     gutterBottom
    //                     sx={{ color: 'brand.main' }}
    //                   >
    //                     Quick Actions
    //                   </Typography>
    //                   <Box display="flex" flexDirection="column" gap={2}>
    //                     {role === 'admin' ? (
    //                       <>
    //                         <Button variant="outlined" fullWidth startIcon={<PeopleIcon />}>
    //                           Add New User
    //                         </Button>
    //                         <Button variant="outlined" fullWidth startIcon={<SportsIcon />}>
    //                           Create AR Spot
    //                         </Button>
    //                         <Button variant="outlined" fullWidth startIcon={<CollectiblesIcon />}>
    //                           Add Collectible
    //                         </Button>
    //                       </>
    //                     ) : (
    //                       <>
    //                         <Button variant="outlined" fullWidth startIcon={<RedeemIcon />}>
    //                           Create Voucher
    //                         </Button>
    //                         <Button variant="outlined" fullWidth startIcon={<StoreIcon />}>
    //                           Update Store
    //                         </Button>
    //                         <Button variant="outlined" fullWidth startIcon={<TrendingUpIcon />}>
    //                           View Analytics
    //                         </Button>
    //                       </>
    //                     )}
    //                   </Box>
    //                 </CardContent>
    //               </Card>
    //             </Grid>
    //           </Grid>
    //         </Grid>
    //       </Grid>

    //       {/* Menu */}
    //       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
    //         <MenuItem onClick={handleMenuClose}>
    //           <Settings sx={{ mr: 2 }} />
    //           Settings
    //         </MenuItem>
    //         <MenuItem onClick={handleMenuClose}>
    //           <Notifications sx={{ mr: 2 }} />
    //           Notifications
    //         </MenuItem>
    //       </Menu>
    //     </Box>
    <></>
  );
}
