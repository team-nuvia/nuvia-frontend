'use client';

import { Box, Container, useTheme } from '@mui/material';
import PrivacyContent from '../organism/PrivacyContent';

interface PrivacyProps {}
const Privacy: React.FC<PrivacyProps> = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: 3,
            p: 6,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <PrivacyContent />
        </Box>
      </Container>
    </Box>
  );
};

export default Privacy;
