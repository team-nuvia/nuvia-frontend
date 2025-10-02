import NuviaLogo from '@/assets/NuviaLogo';
import { VERSION } from '@common/variables';
import CommonText from '@components/atom/CommonText';
import LinkText from '@components/atom/LinkText';
import { Stack, SvgIcon, Typography } from '@mui/material';
import { useMemo } from 'react';

interface BrandHeadProps {
  title: string;
  width: number;
  height: number;
  primaryColor: string;
  secondaryColor: string;
  noRoute?: boolean;
  showVersion?: boolean;
}
const BrandHead: React.FC<BrandHeadProps> = ({ title, width, height, primaryColor, secondaryColor, noRoute = false, showVersion = false }) => {
  const memoizeRoute = useMemo(() => {
    if (noRoute) {
      return (
        <CommonText
          variant="h5"
          thickness="bold"
          gutterBottom
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
          {title}2
        </CommonText>
      );
    }
    return (
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
    );
  }, [noRoute]);

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
      <Stack direction="row" alignItems="flex-end" gap={1}>
        {memoizeRoute}
        {showVersion && VERSION.match(/alpha|beta/g) && (
          <Typography color="text.secondary" fontSize="0.65rem">
            {VERSION}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default BrandHead;
