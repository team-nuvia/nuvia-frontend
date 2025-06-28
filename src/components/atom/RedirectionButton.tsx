import { ButtonOwnProps } from '@mui/material';
import Link from 'next/link';
import CommonButton from './CommonButton';

interface RedirectionButtonProps {
  label: string;
  to: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const RedirectionButton: React.FC<RedirectionButtonProps & ButtonOwnProps> = ({
  label,
  to,
  startIcon,
  endIcon,
  ...props
}) => {
  return (
    <CommonButton
      component={Link}
      href={to}
      startIcon={startIcon}
      endIcon={endIcon}
      {...props}
    >
      {label}
    </CommonButton>
  );
};

export default RedirectionButton;
