import GoogleIcon from '@assets/GoogleIcon';
import { Stack, SvgIcon, Typography } from '@mui/material';
import ActionButton from './ActionButton';

interface GoogleLoginButtonProps extends ActionButtonProps {}
const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = (props) => {
  return (
    <ActionButton
      fullWidth
      color="inherit"
      startIcon={
        <SvgIcon>
          <GoogleIcon />
        </SvgIcon>
      }
      {...props}
    >
      <Typography>Sign in with Google</Typography>
    </ActionButton>
  );
};

export default GoogleLoginButton;
