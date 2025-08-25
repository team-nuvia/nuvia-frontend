import CommonText from '@components/atom/CommonText';
import Showbox from '@components/atom/Showbox';
import { BaseSection } from '@components/organism/BaseSection';
import { Analytics, BarChart, TrendingUp } from '@mui/icons-material';
import { Box, Card, Grid, Stack, Typography, useTheme } from '@mui/material';

export const AnalyticsPreviewSection = () => {
  const theme = useTheme();
  return (
    <Box sx={{ backgroundColor: theme.palette.grey[50], py: { xs: 12, md: 16 }, position: 'relative' }}>
      <BaseSection>
        <Stack spacing={4} alignItems="center" textAlign="center" mb={6}>
          <Showbox>
            <CommonText variant="h3" thickness="bold" gutterBottom>
              응답이 들어오면 자동으로 이런 차트가 생겨요
            </CommonText>
          </Showbox>
          <Showbox>
            <CommonText variant="body1" color="text.secondary">
              막대/라인/히스토그램 3종 차트로 결과를 한눈에
            </CommonText>
          </Showbox>
        </Stack>

        <Showbox>
          <Card sx={{ borderRadius: 3, boxShadow: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 4, backgroundColor: 'white' }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <BarChart sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      막대 차트
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      응답 분포 시각화
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <TrendingUp sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      라인 차트
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      응답 추이 분석
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <Analytics sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      히스토그램
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      데이터 분포 확인
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Showbox>
      </BaseSection>
    </Box>
  );
};
