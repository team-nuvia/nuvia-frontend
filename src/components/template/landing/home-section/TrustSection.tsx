import CommonText from '@components/atom/CommonText';
import Showbox from '@components/atom/Showbox';
import { BaseSection } from '@components/organism/BaseSection';
import { CheckCircle, LockOpen, Security } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Stack, Typography, useTheme } from '@mui/material';

export const TrustSection = () => {
  const theme = useTheme();
  const trustPoints = [
    {
      icon: <Security sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'K-익명성 마스킹',
      description: '소표본 비노출로 개인정보 보호',
    },
    {
      icon: <LockOpen sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: '세션/토큰 분리',
      description: 'JWS+세션 쿠키, HTTPS 보안',
    },
    {
      icon: <CheckCircle sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: '데이터 소유권',
      description: '데이터 소유권은 발행자에게',
    },
  ];

  return (
    <Box sx={{ backgroundColor: theme.palette.background.paper, py: { xs: 12, md: 16 }, position: 'relative' }}>
      <BaseSection>
        <Stack spacing={3} alignItems="center" textAlign="center" mb={6}>
          <Showbox>
            <CommonText variant="h3" thickness="bold" gutterBottom>
              보안과 프라이버시를 약속합니다
            </CommonText>
          </Showbox>
          <Showbox>
            <CommonText variant="body1" color="text.secondary">
              기관/공공 확장을 위한 신뢰할 수 있는 보안 시스템
            </CommonText>
          </Showbox>
        </Stack>

        <Grid container spacing={4}>
          {trustPoints.map((point, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 4 }}>
              <Showbox>
                <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2, textAlign: 'center' }}>
                  <CardContent sx={{ py: 4 }}>
                    {point.icon}
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      {point.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {point.description}
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
