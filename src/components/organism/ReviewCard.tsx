import {
  Card,
  Typography,
  Avatar,
  Box,
  CardContent,
  SxProps,
  Theme,
  Paper,
} from '@mui/material';
import { Star } from '@mui/icons-material';

interface ReviewCardProps {
  txt: string;
  av: string;
  who: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ txt, av, who }) => {
  return (
    <Paper
      sx={{
        p: 5,
        height: '100%',
        borderRadius: 3,
        backgroundColor: 'background.paper',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: '150ms ease-in-out',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
    >
      <Box display="flex" mb={2}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} sx={{ color: '#ffd700', fontSize: 20 }} />
        ))}
      </Box>
      <Typography
        variant="body1"
        sx={{ mb: 3, fontStyle: 'italic', lineHeight: 1.6 }}
      >
        "{txt}"
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          {av}
        </Avatar>
        <Typography variant="body2" fontWeight={500} color="text.secondary">
          {who}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ReviewCard;
