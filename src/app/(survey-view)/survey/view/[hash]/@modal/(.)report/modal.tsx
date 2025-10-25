'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Backdrop, Box, IconButton, Paper, Portal } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ModalProps {
  children?: React.ReactNode;
}

export function Modal({ children }: ModalProps) {
  const router = useRouter();

  useEffect(() => {
    // ESC 키로 닫기
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        router.back();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  function onDismiss() {
    router.back();
  }

  return (
    <Portal>
      <Backdrop
        open={true}
        onClick={onDismiss}
        sx={{
          zIndex: 1300,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />
      <Paper
        elevation={8}
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1400,
          maxWidth: '90vw',
          maxHeight: '90vh',
          width: { xs: '95%', sm: 500 },
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <IconButton
          onClick={onDismiss}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            },
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box sx={{ overflow: 'auto', maxHeight: '90vh' }}>{children}</Box>
      </Paper>
    </Portal>
  );
}
