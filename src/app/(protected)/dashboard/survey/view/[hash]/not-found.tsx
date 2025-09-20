'use client';

import ActionButton from '@components/atom/ActionButton';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        p: 4,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom color="text.secondary">
        설문을 찾을 수 없습니다.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        요청하신 설문이 존재하지 않거나 접근할 수 없는 상태입니다.
      </Typography>
      <ActionButton variant="contained" color="primary" onClick={() => router.push('/')}>
        홈으로 돌아가기
      </ActionButton>
    </Box>
  );
};

export default Page;
