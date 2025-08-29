'use client';

import { AuthenticationContext } from '@context/AuthenticationContext';
import { Stack } from '@mui/material';
import { useContext } from 'react';
import Sidebar from './Sidebar';

interface WrapChildrenProps {
  children: React.ReactNode;
}
const WrapChildren: React.FC<WrapChildrenProps> = ({ children }) => {
  const { isVerified } = useContext(AuthenticationContext);

  return (
    <Stack direction="row" flex={1}>
      {isVerified && <Sidebar />}
      <Stack flex={1} sx={{ overflowX: 'hidden' }}>
        {children}
      </Stack>
    </Stack>
  );
};

export default WrapChildren;
