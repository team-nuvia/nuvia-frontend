'use client';

import { Stack } from '@mui/material';

interface WrapChildrenProps {
  children: React.ReactNode;
}
const WrapChildren: React.FC<WrapChildrenProps> = ({ children }) => {
  return <Stack flex={1}>{children}</Stack>;
};

export default WrapChildren;
