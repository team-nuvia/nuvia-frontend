import { Box } from '@mui/material';
import React from 'react';

const FixedSkeleton = ({ width, height, borderRadius = 1, color = 'grey.300' }: { width: number | string; height: string | number; borderRadius?: number; color?: string }) => {
  return <Box component="div" sx={{ width, height, bgcolor: color, borderRadius }} />;
};

export default FixedSkeleton;
