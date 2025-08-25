import CommonText from '@components/atom/CommonText';
import Showbox from '@components/atom/Showbox';
import { BaseSection } from '@components/organism/BaseSection';
import { Analytics, BarChart, Create, Download, PhotoCamera, TrendingUp } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Grid, Stack, Typography, useTheme } from '@mui/material';

export const KeyFeaturesSection = () => {
  const theme = useTheme();
  const features = [
    {
      icon: <Create sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: '간편 설문 생성',
      description: '단일/다중/숫자/날짜/텍스트',
      premium: false,
    },
    {
      icon: <Analytics sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: '자동 분포·추이 분석',
      description: '질문별 카드 자동 렌더',
      premium: false,
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: '응답 속도 & 증가율',
      description: '최근 30일 변화 추적',
      premium: false,
    },
    {
      icon: <Download sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'CSV 내보내기',
      description: '팀 공유/2차 가공',
      premium: false,
    },
    {
      icon: <BarChart sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: '조건부 분포/교차표/리프트',
      description: '고급 분석 기능',
      premium: true,
    },
    {
      icon: <PhotoCamera sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: '뷰 저장/공유, PDF 리포트',
      description: '프리미엄 기능',
      premium: true,
    },
  ];

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, py: { xs: 12, md: 16 }, position: 'relative' }}>
      <BaseSection>
        <Stack spacing={3} alignItems="center" textAlign="center" mb={6}>
          <Showbox>
            <CommonText variant="h3" thickness="bold" gutterBottom>
              지금 당장 쓸 수 있는 가치
            </CommonText>
          </Showbox>
          <Showbox>
            <CommonText variant="body1" color="text.secondary">
              핵심 기능은 무료로, 고급 기능은 프리미엄으로
            </CommonText>
          </Showbox>
        </Stack>

        <Grid container spacing={3}>
          {features.map((feature, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
              <Showbox>
                <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2, position: 'relative' }}>
                  {feature.premium && <Chip label="Premium" color="secondary" size="small" sx={{ position: 'absolute', top: 16, right: 16 }} />}
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    {feature.icon}
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Showbox>
            </Grid>
          ))}
        </Grid>
      </BaseSection>
    </Box>
  );
};
