import { ButtonOwnProps } from '@mui/material';
import CommonButton from './CommonButton';

interface ActionButtonProps {}
const ActionButton: React.FC<ActionButtonProps & ButtonOwnProps> = ({
  children,
  ...props
}) => {
  return <CommonButton {...props}>{children}</CommonButton>;
};

export default ActionButton;
