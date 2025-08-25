import CommonText from '@components/atom/CommonText';
import CTAButton from '@components/atom/CTAButton';
import { BaseSection } from '@components/organism/BaseSection';
import { Box, Container, Stack, useTheme } from '@mui/material';

export const FinalCTASection = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        py: { xs: 10, md: 12 },
        px: { xs: 2, md: 4 },
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      }}
    >
      <BaseSection>
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <CommonText color="white" variant="h3" thickness="bold">
              지금, 5분 만에 첫 설문을 만들어보세요
            </CommonText>
            <CommonText color="white" variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
              누비아와 함께 설문의 새로운 경험을 시작하세요
            </CommonText>
            <CTAButton invert />
          </Stack>
        </Container>
      </BaseSection>
    </Box>
  );
};
