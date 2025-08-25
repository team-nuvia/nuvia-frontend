'use client';
import { BaseSection } from '@components/organism/BaseSection';
import { Analytics, CheckCircle, Create, Share } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Container, Grid, Typography, useTheme } from '@mui/material';
import { getFadeUpStyles } from '@util/getFadeUpStyles';
import { useInView } from 'react-intersection-observer';

export default function SolutionSection() {
  const theme = useTheme();
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  const steps = [
    {
      icon: <Create sx={{ fontSize: 56, color: theme.palette.primary.main }} />,
      title: '직관적인 설문 제작',
      description: '드래그 앤 드롭으로 3분 만에 완성',
      features: ['템플릿 제공', '실시간 미리보기', '다양한 질문 유형'],
      time: '3분',
    },
    {
      icon: <Share sx={{ fontSize: 56, color: theme.palette.success.main }} />,
      title: '원클릭 공유',
      description: 'QR코드, 링크, SNS로 즉시 배포',
      features: ['QR코드 생성', '소셜 공유', '임베드 코드'],
      time: '1분',
    },
    {
      icon: <Analytics sx={{ fontSize: 56, color: theme.palette.secondary.main }} />,
      title: '실시간 분석',
      description: '응답과 동시에 자동 차트 생성',
      features: ['실시간 대시보드', '자동 차트', '엑셀 다운로드'],
      time: '1분',
    },
  ];

  return (
    <BaseSection ref={ref}>
      <Container maxWidth="lg" sx={{ py: { xs: 12, md: 16 } }}>
        <Box textAlign="center" sx={{ mb: 10, ...getFadeUpStyles(inView) }}>
          <Chip
            label="Nuvia의 해결책"
            sx={{
              mb: 3,
              px: 3,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 600,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
            }}
          />

          <Typography
            variant="h2"
            sx={{
              mb: 4,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            누비아는 다릅니다
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            질문 만들기부터 결과 분석까지,{' '}
            <Box component="span" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              단 5분
            </Box>
            이면 모든 것이 완료됩니다.
          </Typography>

          <Box
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <CheckCircle sx={{ color: theme.palette.success.main }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              평균 응답률 85% 달성
            </Typography>
            <CheckCircle sx={{ color: theme.palette.success.main }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              제작 시간 90% 단축
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Card
                sx={{
                  height: '100%',
                  p: 4,
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, #f8fafc 100%)`,
                  border: `2px solid transparent`,
                  backgroundClip: 'padding-box',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                  ...getFadeUpStyles(inView, 200 + idx * 200),
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 0 }}>
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: '50%',
                      backgroundColor: `${theme.palette.primary.main}10`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {step.icon}
                  </Box>

                  <Chip
                    label={`${step.time} 소요`}
                    size="small"
                    sx={{
                      mb: 2,
                      backgroundColor: theme.palette.success.light,
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />

                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                    {step.title}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                    {step.description}
                  </Typography>

                  <Box sx={{ textAlign: 'left' }}>
                    {step.features.map((feature, featureIdx) => (
                      <Box key={featureIdx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckCircle sx={{ fontSize: 16, color: theme.palette.success.main, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" sx={{ mt: 8, ...getFadeUpStyles(inView, 800) }}>
          <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            💡 기존 도구 대비 평균 제작 시간: 30분 → 5분
          </Typography>
        </Box>
      </Container>
    </BaseSection>
  );
}
