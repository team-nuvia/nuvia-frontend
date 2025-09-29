'use client';

import { useAuthStore } from '@/store/auth.store';
import { Stack } from '@mui/material';
import Sidebar from './Sidebar';

interface WrapChildrenProps {
  children: React.ReactNode;
}
const WrapChildren: React.FC<WrapChildrenProps> = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return (
      <Stack direction="row" flex={1}>
        <Sidebar />
        <Stack flex={1} sx={{ overflowX: 'hidden' }}>
          {children}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack direction="row" flex={1}>
      <Stack flex={1} sx={{ overflowX: 'hidden' }}>
        {children}
      </Stack>
    </Stack>
  );
};

export default WrapChildren;
