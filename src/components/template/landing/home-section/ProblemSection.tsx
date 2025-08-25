'use client';
import { BaseSection } from '@components/organism/BaseSection';
import { AccessTime, ErrorOutline, TrendingDown } from '@mui/icons-material';
import { Box, Container, Grid, Paper, Typography, useTheme } from '@mui/material';
import { getFadeUpStyles } from '@util/getFadeUpStyles';
import { useInView } from 'react-intersection-observer';

export default function ProblemSection() {
  const theme = useTheme();
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const problems = [
    {
      icon: <AccessTime sx={{ fontSize: 32, color: theme.palette.error.main }} />,
      title: '설문 제작에 30분 이상 소요',
      description: '복잡한 인터페이스로 인한 시간 낭비',
    },
    {
      icon: <ErrorOutline sx={{ fontSize: 32, color: theme.palette.error.main }} />,
      title: '응답률 평균 15% 미만',
      description: '번거로운 가입 절차로 인한 이탈',
    },
    {
      icon: <TrendingDown sx={{ fontSize: 32, color: theme.palette.error.main }} />,
      title: '데이터 분석의 어려움',
      description: '결과 해석을 위한 추가 작업 필요',
    },
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #e2e8f0 100%)`,
        py: { xs: 10, md: 16 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BaseSection ref={ref} maxWidth="lg">
        {/* 배경 장식 요소 */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}20)`,
            filter: 'blur(40px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${theme.palette.secondary.light}15, ${theme.palette.primary.light}15)`,
            filter: 'blur(60px)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" sx={getFadeUpStyles(inView)}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                mb: 2,
              }}
            >
              현재 설문 도구들의 문제점
            </Typography>

            <Typography
              variant="h1"
              sx={{
                mb: 4,
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
              }}
            >
              설문 만들기,
              <br />왜 이렇게 복잡해야 할까요?
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 8,
                color: theme.palette.text.secondary,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              매번 반복되는 번거로운 과정, 낮은 응답률, 복잡한 결과 분석...
              <br />
              <strong>더 나은 방법이 있을 텐데요.</strong>
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            {problems.map((problem, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    },
                    ...getFadeUpStyles(inView, 300 + index * 150),
                  }}
                >
                  <Box sx={{ mb: 3 }}>{problem.icon}</Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
                    {problem.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {problem.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </BaseSection>
    </Box>
  );
}
