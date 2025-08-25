import CommonText from '@components/atom/CommonText';
import CTAButton from '@components/atom/CTAButton';
import Showbox from '@components/atom/Showbox';
import { BaseSection } from '@components/organism/BaseSection';
import { Box, Stack, useTheme } from '@mui/material';

export const PricingTeaserSection = () => {
  const theme = useTheme();
  return (
    <Box sx={{ backgroundColor: theme.palette.grey[50], py: { xs: 12, md: 16 }, position: 'relative' }}>
      <BaseSection>
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Showbox>
            <CommonText variant="h3" thickness="bold" gutterBottom>
              지금은 무료로 시작하세요
            </CommonText>
          </Showbox>
          <Showbox>
            <CommonText variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              추후 Standard / Premium 단계적으로 오픈 (비교 분석/리프트/PDF)
            </CommonText>
          </Showbox>
          <Showbox>
            <CTAButton />
          </Showbox>
        </Stack>
      </BaseSection>
    </Box>
  );
};
