import { useAuthStore } from '@/store/auth.store';
import { Ballot } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import ActionButton from './ActionButton';

interface CTAButtonProps {
  invert?: boolean;
  label?: string;
  path?: string;
}
const CTAButton: React.FC<CTAButtonProps> = ({ invert, label, path = '/auth/login' }) => {
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
      sx={{
        px: 4,
        py: 1.5,
        fontSize: '1.1rem',
        '&:hover': { bgcolor: invert ? '#f5f5f5' : theme.palette.primary.light },
      }}
      color={invert ? 'white' : 'primary'}
      startIcon={<Ballot />}
      onClick={handleClick}
    >
      {label || '무료로 시작하기'}
    </ActionButton>
  );
};

export default CTAButton;
