import { TypographyProps } from '@mui/material';
import Link from 'next/link';
import CommonText from './CommonText';

interface LinkTextProps {
  to: string;
  children: React.ReactNode;
}
const LinkText: React.FC<LinkTextProps & TypographyProps> = ({
  to,
  children,
  ...props
}) => {
  return (
    <Link href={to} style={{ textDecoration: 'none', color: 'inherit' }}>
      <CommonText {...props}>{children}</CommonText>
    </Link>
  );
};

export default LinkText;
