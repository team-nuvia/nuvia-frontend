import CommonText from '@components/atom/CommonText';
import Showbox from '@components/atom/Showbox';
import { BaseSection } from '@components/organism/BaseSection';
import { Analytics, ArrowForward, Create, Share } from '@mui/icons-material';
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';

export const HowItWorksSection = () => {
  const theme = useTheme();
  const steps = [
    {
      number: '01',
      title: '설문 만들기',
      description: '직관적인 인터페이스로 몇 분 만에 설문 완성',
      icon: <Create sx={{ fontSize: 40, color: theme.palette.white.main }} />,
    },
    {
      number: '02',
      title: '링크 공유',
      description: '생성된 링크를 응답자에게 공유',
      icon: <Share sx={{ fontSize: 40, color: theme.palette.white.main }} />,
    },
    {
      number: '03',
      title: '결과 분석 & 내보내기',
      description: '실시간으로 응답 분석하고 CSV로 내보내기',
      icon: <Analytics sx={{ fontSize: 40, color: theme.palette.white.main }} />,
    },
  ];

  return (
    <Box sx={{ backgroundColor: theme.palette.grey[50], py: { xs: 12, md: 16 }, position: 'relative' }}>
      <BaseSection>
        <Stack spacing={3} alignItems="center" textAlign="center" mb={6}>
          <Showbox>
            <CommonText variant="h3" thickness="bold" gutterBottom>
              3단계로 설문 완성
            </CommonText>
          </Showbox>
          <Showbox>
            <CommonText variant="body1" color="text.secondary">
              복잡한 과정 없이 간단하게 설문을 만들어보세요
            </CommonText>
          </Showbox>
        </Stack>

        <Grid container spacing={4}>
          {steps.map((step, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 4 }}>
              <Showbox>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  {idx < steps.length - 1 && (
                    <Box
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        position: 'absolute',
                        top: 60,
                        right: -32,
                        zIndex: 1,
                      }}
                    >
                      <ArrowForward sx={{ fontSize: 32, color: theme.palette.grey[400] }} />
                    </Box>
                  )}
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      backgroundColor: theme.palette.primary.light,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: theme.palette.primary.main }}>
                    {step.number}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Showbox>
            </Grid>
          ))}
        </Grid>
      </BaseSection>
    </Box>
  );
};
