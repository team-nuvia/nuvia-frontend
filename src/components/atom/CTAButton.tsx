import { useAuthStore } from '@/store/auth.store';
import { Ballot } from '@mui/icons-material';
import { ButtonOwnProps, SxProps, Theme, useTheme } from '@mui/material';
import ActionButton from './ActionButton';

interface CTAButtonProps {
  invert?: boolean;
  label?: string;
  path?: string;
  sx?: SxProps<Theme>;
  startIcon?: React.ReactNode;
}
const CTAButton: React.FC<CTAButtonProps & ButtonOwnProps> = ({ invert, label, path = '/auth/login', sx, startIcon, ...props }) => {
  const theme = useTheme();
  const router = useAuthStore((state) => state.router)!;

  function handleClick() {
    if (path) {
      router.push(path);
    }
  }

  function handlePrefetch() {
    if (path) {
      router.prefetch(path);
    }
  }

  return (
    <ActionButton
      variant="contained"
      size="large"
      sx={[
        {
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
      startIcon={startIcon || <Ballot />}
      onClick={handleClick}
      onMouseEnter={handlePrefetch}
      {...props}
    >
      {label || '무료로 시작하기'}
    </ActionButton>
  );
};

export default CTAButton;
