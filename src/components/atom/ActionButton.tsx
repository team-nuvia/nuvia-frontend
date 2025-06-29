import { ButtonProps } from '@mui/material';
import CommonButton from './CommonButton';

interface ActionButtonProps {}
const ActionButton: React.FC<ActionButtonProps & ButtonProps> = ({
  children,
  ...props
}) => {
  return <CommonButton {...props}>{children}</CommonButton>;
};

export default ActionButton;
