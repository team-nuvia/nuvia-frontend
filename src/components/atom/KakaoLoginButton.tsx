import { SvgIcon, Typography } from '@mui/material';
import ActionButton from './ActionButton';
import KakaoIcon from '@assets/KakaoIcon';

interface KakaoLoginButtonProps extends ActionButtonProps {}
const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = (props) => {
  return (
    <ActionButton
      fullWidth
      color="kakao"
      startIcon={
        <SvgIcon sx={{ color: '#181600' }}>
          <KakaoIcon />
        </SvgIcon>
      }
      {...props}
    >
      <Typography>Sign in with Kakao</Typography>
    </ActionButton>
  );
};

export default KakaoLoginButton;
