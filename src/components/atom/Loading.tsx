'use client';

import LoadingContext from '@/context/LodingContext';
import { Backdrop, CircularProgress } from '@mui/material';
import { useContext } from 'react';

interface LoadingProps {}
const Loading: React.FC<LoadingProps> = () => {
  const { loading } = useContext(LoadingContext);

  return (
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
