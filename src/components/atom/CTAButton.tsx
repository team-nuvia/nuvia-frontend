import { useAuthStore } from '@/store/auth.store';
import { Ballot } from '@mui/icons-material';
import { SxProps, Theme, useTheme } from '@mui/material';
import ActionButton from './ActionButton';

interface CTAButtonProps {
  invert?: boolean;
  label?: string;
  path?: string;
  sx?: SxProps<Theme>;
}
const CTAButton: React.FC<CTAButtonProps> = ({ invert, label, path = '/auth/login', sx }) => {
  const theme = useTheme();
  const router = useAuthStore((state) => state.router)!;

  function handleClick() {
    if (path) {
      router.push(path);
    }
  }

  return (
    <ActionButton
      variant="contained"
      size="large"
      sx={[
        {
          px: invert ? 6 : 4,
          py: invert ? 2 : 1.5,
          fontSize: invert ? '1.125rem' : '1.1rem',
          fontWeight: invert ? 600 : 500,
          borderRadius: invert ? 3 : 2,
          boxShadow: invert ? '0 8px 32px rgba(0,0,0,0.12)' : '0 4px 16px rgba(0,0,0,0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { 
            bgcolor: invert ? theme.palette.grey[50] : theme.palette.primary.light,
            transform: invert ? 'translateY(-2px)' : 'translateY(-1px)',
            boxShadow: invert ? '0 12px 40px rgba(0,0,0,0.18)' : '0 6px 20px rgba(0,0,0,0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      color={invert ? 'white' : 'primary'}
      startIcon={<Ballot />}
      onClick={handleClick}
    >
      {label || '무료로 시작하기'}
    </ActionButton>
  );
};

export default CTAButton;
