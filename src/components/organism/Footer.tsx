'use client';

import { BRAND_NAME } from '@common/variables';
import CommonText from '@components/atom/CommonText';
import LinkText from '@components/atom/LinkText';
import BrandHead from '@components/molecular/BrandHead';
import { Divider, Stack } from '@mui/material';

interface FooterProps {}
const Footer: React.FC<FooterProps> = () => {
  return (
    <Stack
      component="footer"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        borderTopWidth: 1,
        borderTopColor: (theme) => theme.palette.divider,
        borderTopStyle: 'solid',
        p: '1rem',
        mt: 'auto',
        minHeight: 64,
      }}
      spacing={2}
    >
      <BrandHead title={BRAND_NAME} width={28} height={28} />
      <CommonText variant="body2" color="text.secondary">
        © {new Date().getFullYear()} {BRAND_NAME} | All rights reserved.
      </CommonText>
      <Stack direction="row" spacing={2}>
        <LinkText to="/privacy" variant="body2" color="text.secondary">
          개인정보처리방침
        </LinkText>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <LinkText to="/terms" variant="body2" color="text.secondary">
          이용약관
        </LinkText>
      </Stack>
    </Stack>
  );
};

export default Footer;
