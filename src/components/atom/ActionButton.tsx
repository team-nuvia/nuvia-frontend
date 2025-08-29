import { ButtonProps, CircularProgress } from '@mui/material';
import CommonButton from './CommonButton';

interface ActionButtonProps extends ButtonProps {
  label?: string;
  isLoading?: boolean;
}
const ActionButton: React.FC<ActionButtonProps> = ({ children, isLoading, disabled, startIcon, ...props }) => {
  return (
    <CommonButton
      {...props}
      startIcon={isLoading !== undefined ? isLoading && <CircularProgress size="inherit" color="white" /> : startIcon}
      disabled={isLoading !== undefined ? isLoading : disabled}
    >
      {children}
    </CommonButton>
  );
};

export default ActionButton;
