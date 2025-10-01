'use client';

import { alpha, Box, Card, CardContent, Chip, Container, Fade, Grid, Paper, styled, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  borderRadius: 24,
  padding: theme.spacing(8, 4),
  marginBottom: theme.spacing(6),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  background: theme.palette.background.paper,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
    borderColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

const ProblemCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
  background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.05)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.error.main, 0.15)}`,
    borderColor: alpha(theme.palette.error.main, 0.2),
  },
}));

const SolutionCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.success.main, 0.15)}`,
    borderColor: alpha(theme.palette.success.main, 0.2),
  },
}));

const ValueCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
  background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.secondary.main, 0.15)}`,
    borderColor: alpha(theme.palette.secondary.main, 0.2),
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  fontSize: 32,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 700,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: 1,
}));

const FloatingElement = styled(Box)<{ delay: number }>(({ theme, delay }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  animation: `float 6s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-20px)',
    },
  },
}));

const About: React.FC = () => {
  const theme = useTheme();
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-section') || '0');
            setVisibleSections((prev) => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const stats = [
    { number: '20+', label: '기본 응답자 수' },
    { number: '0', label: '가입 필요 없음' },
    { number: '100%', label: '무료 사용' },
  ];

  const problems = [
    { icon: '🔐', title: '복잡한 가입 과정', description: '간단한 설문을 위해 회원가입부터 시작해야 하는 번거로움' },
    { icon: '⚙️', title: '과도한 설정', description: '필요 이상으로 복잡한 옵션들과 설정들' },
    { icon: '📊', title: '이해하기 어려운 결과', description: '복잡한 차트와 통계로 인한 결과 해석의 어려움' },
  ];

  const solutions = [
    { icon: '⚡', title: '즉시 시작', description: '질문 몇 개만으로 바로 설문을 만들 수 있어요' },
    { icon: '🔗', title: '간편한 공유', description: '회원가입 없이도 설문을 만들고 링크로 공유할 수 있어요' },
    { icon: '📈', title: '직관적인 결과', description: '결과는 보기 좋게, 이해하기 쉽게 정리돼요' },
  ];

  const values = [
    { icon: '🛡️', title: '데이터 보호', description: '응답 데이터를 소중히 다루고 안전하게 보관합니다' },
    { icon: '📊', title: '정확한 분석', description: '통계와 시각화를 왜곡 없이 정확하게 보여드립니다' },
    { icon: '🤝', title: '사용자 중심', description: '설문 작성자와 응답자 모두를 위한 경험을 제공합니다' },
  ];

  return (
    <Box sx={{ py: 8 }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <HeroSection>
          <FloatingElement delay={0} sx={{ width: 60, height: 60, top: '10%', left: '10%' }} />
          <FloatingElement delay={2} sx={{ width: 40, height: 40, top: '20%', right: '15%' }} />
          <FloatingElement delay={4} sx={{ width: 80, height: 80, bottom: '15%', left: '20%' }} />

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            설문을 더 간단하게
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            복잡한 설정 없이, 회원가입 없이, 바로 시작하는 설문 서비스
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid size={{ xs: 12, sm: 4 }} key={index}>
                <Box textAlign="center">
                  <StatNumber>{stat.number}</StatNumber>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </HeroSection>

        {/* Problems Section */}
        <Box data-section="0" sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            설문, 왜 이렇게 복잡할까요?
          </Typography>

          <Grid container spacing={4}>
            {problems.map((problem, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Fade in={visibleSections.includes(0)} timeout={600 + index * 200}>
                  <ProblemCard>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <IconWrapper
                        sx={{ mx: 'auto', background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.warning.main} 100%)` }}
                      >
                        {problem.icon}
                      </IconWrapper>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {problem.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {problem.description}
                      </Typography>
                    </CardContent>
                  </ProblemCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Solutions Section */}
        <Box data-section="1" sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            그래서 이렇게 만들었어요
          </Typography>

          <Grid container spacing={4}>
            {solutions.map((solution, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Fade in={visibleSections.includes(1)} timeout={600 + index * 200}>
                  <SolutionCard>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <IconWrapper
                        sx={{ mx: 'auto', background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.info.main} 100%)` }}
                      >
                        {solution.icon}
                      </IconWrapper>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {solution.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {solution.description}
                      </Typography>
                    </CardContent>
                  </SolutionCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Values Section */}
        <Box data-section="2" sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            우리의 가치
          </Typography>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Fade in={visibleSections.includes(2)} timeout={600 + index * 200}>
                  <ValueCard>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <IconWrapper
                        sx={{
                          mx: 'auto',
                          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                        }}
                      >
                        {value.icon}
                      </IconWrapper>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {value.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {value.description}
                      </Typography>
                    </CardContent>
                  </ValueCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Mission Statement */}
        <Box data-section="3" sx={{ mb: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              textAlign: 'center',
            }}
          >
            <Fade in={visibleSections.includes(3)} timeout={800}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    fontStyle: 'italic',
                    color: theme.palette.primary.main,
                  }}
                >
                  "복잡함 없이, 설문 본연에 집중"
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 400,
                    maxWidth: 600,
                    mx: 'auto',
                  }}
                >
                  Nuvia는 설문 데이터를 단순히 '모으는 도구'가 아니라
                  <br />
                  <strong>'소통을 위한 기반'</strong>으로 생각합니다.
                </Typography>
              </Box>
            </Fade>
          </Paper>
        </Box>

        {/* Future Vision */}
        <Box data-section="4" sx={{ mb: 8 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Fade in={visibleSections.includes(4)} timeout={600}>
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    조금씩 나아가겠습니다
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                    지금은 작은 도구일지 몰라도, 쌓인 데이터는 언젠가 공공이나 연구기관에게 도움이 될 수도 있습니다.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                    저희는 사용자의 동의 하에, 데이터를 의미 있는 분석에 활용할 수 있는 플랫폼으로 확장하려고 합니다.
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    아직은 실험적인 걸음이지만, 쓰는 사람에게 실질적인 도움이 되는 서비스를 만들고 싶습니다.
                  </Typography>
                </Box>
              </Fade>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Fade in={visibleSections.includes(4)} timeout={800}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(
                      theme.palette.primary.main,
                      0.1,
                    )} 100%)`,
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h2" sx={{ fontSize: '4rem', mb: 2 }}>
                    🚀
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    미래의 비전
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    데이터 기반의 의미 있는 인사이트를 제공하는 플랫폼으로 성장
                  </Typography>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Box>

        {/* About Creator */}
        <Box data-section="5">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.grey[100], 0.5)} 0%, ${alpha(theme.palette.grey[50], 0.5)} 100%)`,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              textAlign: 'center',
            }}
          >
            <Fade in={visibleSections.includes(5)} timeout={600}>
              <Box>
                <Typography variant="h3" sx={{ mb: 3, fontWeight: 600 }}>
                  만든 사람에 대하여
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                  Nuvia는 혼자서 개발하고, 기획하고, 디자인하며 만들어가는 프로젝트입니다.
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                  서비스라는 게 꼭 거창해야 하는 건 아니니까요. 작은 불편함을 해소하는 것부터 시작해 보았습니다.
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
                  피드백은 언제든 환영이에요. 함께 만들어주세요.
                </Typography>
                <Chip
                  label="피드백 보내기"
                  color="primary"
                  variant="outlined"
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                />
              </Box>
            </Fade>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
