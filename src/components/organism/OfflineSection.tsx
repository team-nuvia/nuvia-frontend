import WifiOffIcon from '@mui/icons-material/WifiOff';
import { Box, Button, Paper, Typography } from '@mui/material';

interface OfflineSectionProps {}
const OfflineSection: React.FC<OfflineSectionProps> = () => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        background: 'none',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          width: 90,
          height: 90,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(26,26,26,0.85)' : 'rgba(245,245,247,0.95)'),
          boxShadow: (theme) => (theme.palette.mode === 'dark' ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 16px rgba(0,0,0,0.08)'),
        }}
      >
        <WifiOffIcon sx={{ fontSize: 48, color: 'error.main', opacity: 0.85 }} />
      </Paper>
      <Typography variant="h5" fontWeight={700} color="text.primary" mb={1} textAlign="center">
        오프라인 상태입니다
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3} textAlign="center" sx={{ lineHeight: 1.7 }}>
        인터넷 연결이 끊어졌어요.
        <br />
        네트워크를 확인한 후<br />
        새로고침 해주세요.
      </Typography>
    </Box>
  );
};

export default OfflineSection;
