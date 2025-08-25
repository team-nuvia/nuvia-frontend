import NuviaLogo from '@/assets/NuviaLogo';
import LinkText from '@components/atom/LinkText';
import { Stack, SvgIcon, Typography } from '@mui/material';

interface BrandHeadProps {
  title: string;
  width: number;
  height: number;
  primaryColor: string;
  secondaryColor: string;
  noRoute?: boolean;
}
const BrandHead: React.FC<BrandHeadProps> = ({ title, width, height, primaryColor, secondaryColor, noRoute = false }) => {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <SvgIcon
        sx={{
          width: width,
          height: height,
          color: primaryColor,
        }}
      >
        <NuviaLogo />
      </SvgIcon>
      {noRoute ? (
        <Typography
          variant="h5"
          thickness="bold"
          color="text.primary"
          fontFamily="Noto Sans KR"
          sx={{
            color: primaryColor,
            background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </Typography>
      ) : (
        <LinkText
          to="/"
          variant="h5"
          thickness="bold"
          color="text.primary"
          fontFamily="Noto Sans KR"
          sx={{
            color: primaryColor,
            background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </LinkText>
      )}
    </Stack>
  );
};

export default BrandHead;
