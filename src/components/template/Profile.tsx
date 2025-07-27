'use client';

import { AuthenticationContext } from '@context/AuthenticationContext';
import { Stack } from '@mui/material';
import { useContext } from 'react';

interface ProfileProps {}
const Profile: React.FC<ProfileProps> = () => {
  const { user } = useContext(AuthenticationContext);

  return (
    <Stack flex={1} gap={4}>
      profile {user?.name}
    </Stack>
  );
};

export default Profile;
