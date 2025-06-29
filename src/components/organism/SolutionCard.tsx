import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  SxProps,
  Theme,
} from '@mui/material';
import React from 'react';

interface SolutionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  direction?: 'column' | 'row';
}
const SolutionCard: React.FC<SolutionCardProps> = ({
  icon,
  title,
  description,
  direction = 'row',
}) => {
  if (direction === 'column') {
    return (
      <Card
        sx={{
          flex: 1,
          textAlign: 'center',
          p: 3,
          borderRadius: 3,
          backgroundColor: 'background.paper',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transition: '150ms ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px) !important',
          },
        }}
      >
        <CardContent>
          <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
            {icon}
          </Stack>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography color="text.secondary">{description}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        width: '100%',
        p: 3,
        borderRadius: 3,
        backgroundColor: 'background.paper',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: '150ms ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px) !important',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          gap: 3,
          alignItems: 'center',
        }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center">
          {icon}
        </Stack>
        <Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SolutionCard;
