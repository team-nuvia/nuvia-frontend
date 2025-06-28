import CommonText from '@components/atom/CommonText';
import LinkText from '@components/atom/LinkText';
import { Stack } from '@mui/material';
import Image from 'next/image';

interface BrandHeadProps {
  title: string;
  logo: string;
  width: number;
  height: number;
}
const BrandHead: React.FC<BrandHeadProps> = ({
  title,
  logo,
  width,
  height,
}) => {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Image src={logo} alt="logo" width={width} height={height} />
      <LinkText
        to="/"
        variant="h6"
        thickness="bold"
        color="text.primary"
        fontFamily="Noto Sans KR"
      >
        {title}
      </LinkText>
    </Stack>
  );
};

export default BrandHead;
