'use client';

import LoadingContext from '@/context/LodingContext';
import ActionButton from '@components/atom/ActionButton';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useContext, useLayoutEffect } from 'react';

interface NotFoundProps {}
const NotFound: React.FC<NotFoundProps> = () => {
  const { endLoading } = useContext(LoadingContext);
  const router = useRouter();

  useLayoutEffect(() => {
    endLoading();
  }, []);

  return (
    <Stack flex={1} alignItems="center" justifyContent="center" gap={3}>
      <Typography component="h1" variant="h1">
        404 Not Found
      </Typography>
      <Typography component="h5" variant="h5">
        페이지를 찾을 수 없습니다.
      </Typography>
      <ActionButton onClick={() => router.push('/')}>홈으로 이동</ActionButton>
      <ActionButton onClick={() => router.back()}>뒤로가기</ActionButton>
    </Stack>
  );
};

export default NotFound;
