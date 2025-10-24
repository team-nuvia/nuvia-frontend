'use client';

import ActionButton from '@components/atom/ActionButton';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';

interface NotFoundProps {
  title?: string;
  reason?: string;
  reload?: boolean;
}

const NotFound = (props?: NotFoundProps) => {
  const router = useRouter();
  const [title, setTitle] = useState<string | null>(props?.title || null);
  const [reason, setReason] = useState<string | null>(props?.reason || null);
  const [reload, setReload] = useState<boolean>(props?.reload || false);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        p: { xs: 3, sm: 4, md: 6 },
        maxWidth: '600px',
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: 'warning.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '6rem', color: (theme) => theme.palette.text.primary, lineHeight: 1 }}>
          <PriorityHighRoundedIcon fontSize="inherit" />
        </Typography>
      </Box>

      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 2,
          fontSize: { xs: '1.75rem', sm: '2.25rem' },
        }}
      >
        {title ? title : '설문을 찾을 수 없습니다'}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          mb: 4,
          lineHeight: 1.6,
          fontSize: '1.1rem',
          maxWidth: '480px',
        }}
      >
        {reason ? reason : '요청하신 설문이 존재하지 않거나 더 이상 사용할 수 없습니다. URL을 다시 확인해 주세요.'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        {reload && (
          <ActionButton
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              minWidth: '140px',
            }}
          >
            새로고침
          </ActionButton>
        )}
        {!reload && (
          <>
            <ActionButton
              variant="contained"
              color="primary"
              onClick={() => router.push('/')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                minWidth: '140px',
              }}
            >
              홈으로 돌아가기
            </ActionButton>
            <ActionButton
              variant="outlined"
              color="primary"
              onClick={() => router.back()}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                minWidth: '140px',
              }}
            >
              이전 페이지로
            </ActionButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default NotFound;
