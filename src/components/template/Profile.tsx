'use client';

import { useAuthStore } from '@/store/auth.store';
import ActionButton from '@components/atom/ActionButton';
import { Settings } from '@mui/icons-material';
import { Box, Container, Grid, Paper, Tab, Tabs, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AccountOverview from './dashboard/user/AccountOverview';
import LatestActive from './dashboard/user/LatestActive';
import Security from './dashboard/user/Security';
import UserProfileCard from './dashboard/user/UserProfileCard';

interface ProfileProps {}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

const Profile: React.FC<ProfileProps> = () => {
  const router = useAuthStore((state) => state.router)!;
  const user = useAuthStore((state) => state.user);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  function handleEditProfile() {
    router.push('/dashboard/user/settings');
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            프로필
          </Typography>
          <ActionButton
            variant="outlined"
            startIcon={<Settings />}
            size="large"
            onClick={handleEditProfile}
            onMouseEnter={() => router.prefetch('/dashboard/user/settings')}
          >
            설정
          </ActionButton>
        </Box>

        <Grid container spacing={4}>
          {/* Profile Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <UserProfileCard user={user} />
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={2}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs" sx={{ px: 3 }}>
                  <Tab label="개요" {...a11yProps(0)} />
                  <Tab label="활동" {...a11yProps(1)} />
                  <Tab label="보안" {...a11yProps(2)} />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <AccountOverview user={user} />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <LatestActive />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Security />
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;
