import NuviaLogo from '@/assets/NuviaLogo';
import LinkText from '@components/atom/LinkText';
import { Stack, SvgIcon, useTheme } from '@mui/material';

interface BrandHeadProps {
  title: string;
  width: number;
  height: number;
}
const BrandHead: React.FC<BrandHeadProps> = ({ title, width, height }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <SvgIcon
        sx={{
          width: width,
          height: height,
          color: theme.palette.primary.dark,
        }}
      >
        <NuviaLogo />
      </SvgIcon>
      <LinkText
        to="/"
        variant="h5"
        thickness="bold"
        color="text.primary"
        fontFamily="Noto Sans KR"
        sx={{
          color: theme.palette.text.primary,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {title}
      </LinkText>
    </Stack>
  );
};

export default BrandHead;
