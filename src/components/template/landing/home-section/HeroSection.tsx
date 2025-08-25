import CommonText from '@components/atom/CommonText';
import CTAButton from '@components/atom/CTAButton';
import Showbox from '@components/atom/Showbox';
import { Box, Container, Stack, useTheme } from '@mui/material';

export const HeroSection = () => {
  const theme = useTheme();
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 16 },
        px: { xs: 2, md: 4 },
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Showbox>
            <CommonText variant="overline" color="primary" sx={{ letterSpacing: 1.2, mb: 2 }}>
              SURVEY • RESEARCH • INSIGHTS
            </CommonText>
          </Showbox>
          <Showbox>
            <CommonText variant="h1" thickness="bold" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              설문은 빠르게, 인사이트는 정확하게
            </CommonText>
          </Showbox>
          <Showbox>
            <CommonText variant="h5" color="text.secondary" sx={{ maxWidth: 600, lineHeight: 1.6 }}>
              누비아는 설문 제작부터 결과 분석까지 한 번에. 응답 분포·추이 분석은 기본, 질문 간 비교도 손쉽게.
            </CommonText>
          </Showbox>
          <Showbox>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <CTAButton label="지금 설문 만들기" />
              <CTAButton label="데모 보기" path="/demo" invert />
            </Stack>
          </Showbox>
        </Stack>
      </Container>
    </Box>
  );
};
