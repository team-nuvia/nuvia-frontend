import { ButtonProps } from '@mui/material';
import CommonButton from './CommonButton';

interface ActionButtonProps extends ButtonProps {
  label?: string;
}
const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  ...props
}) => {
  return <CommonButton {...props}>{children}</CommonButton>;
};

export default ActionButton;
