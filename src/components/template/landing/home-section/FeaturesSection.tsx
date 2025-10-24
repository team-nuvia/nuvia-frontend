'use client';
import Showbox from '@components/atom/Showbox';
import { BaseSection } from '@components/organism/BaseSection';
import { BarChart, LockOpen, PhotoCamera, Security, Smartphone, Timer } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, Chip, Container, Grid, Typography, useTheme } from '@mui/material';

export default function FeaturesSection() {
  const theme = useTheme();

  const features = [
    {
      icon: <PhotoCamera sx={{ fontSize: 40 }} />,
      title: '멀티미디어 응답 지원',
      description: '텍스트, 이미지, 파일 업로드까지 다양한 형태의 응답을 받을 수 있어요',
      details: ['이미지 응답 (최대 10MB)', '파일 첨부 기능', '음성 녹음 응답'],
      color: theme.palette.primary.main,
      badge: 'NEW',
    },
    {
      icon: <LockOpen sx={{ fontSize: 40 }} />,
      title: '조직 협업 설문 제작',
      description: '여러 명이 한 조직 단위로 설문을 함께 생성하고 실시간으로 수정할 수 있어요',
      details: ['조직별 설문 관리', '공동 편집 및 실시간 동기화', '권한 기반 접근 제어'],
      color: theme.palette.success.main,
      badge: '협업',
    },
    {
      icon: <Timer sx={{ fontSize: 40 }} />,
      title: '스마트 응답 관리',
      description: '응답 수 제한, 기간 설정, 중복 방지 등 효율적인 설문 관리 기능',
      details: ['응답 수/기간 제한', 'IP 기반 중복 방지', '실시간 응답 알림'],
      color: theme.palette.warning.main,
      badge: '필수',
    },
    // {
    //   icon: <BarChart sx={{ fontSize: 40 }} />,
    //   title: 'AI 기반 데이터 분석',
    //   description: '복잡한 응답 데이터를 AI가 자동으로 분석하여 인사이트를 제공해드려요',
    //   details: ['자동 차트 생성', '트렌드 분석', '키워드 추출'],
    //   color: theme.palette.secondary.main,
    //   badge: 'AI',
    // },
    {
      icon: <BarChart sx={{ fontSize: 40 }} />,
      title: '다양한 결과 분석 도구',
      description: '수집된 데이터를 시각화하고 교차분석·분포그래프 등 주요 통계 도구를 제공합니다',
      details: ['분포 및 교차분석', '선/막대/파이 그래프', '필터별 응답 추이 확인'],
      color: theme.palette.secondary.main,
      badge: '분석',
    },
    {
      icon: <Smartphone sx={{ fontSize: 40 }} />,
      title: '완벽한 모바일 최적화',
      description: '모든 기기에서 완벽하게 작동하는 반응형 설문 인터페이스',
      details: ['모바일 우선 설계', '터치 친화적 UI', '오프라인 임시저장'],
      color: theme.palette.info.main,
      badge: '반응형',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: '엔터프라이즈급 보안',
      description: '개인정보보호법 완벽 준수, SSL 암호화로 안전한 데이터 처리',
      details: ['SSL 256bit 암호화', 'GDPR 준수', '데이터 자동 삭제'],
      color: theme.palette.error.main,
      badge: '보안',
    },
  ];

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, py: { xs: 12, md: 16 }, position: 'relative' }}>
      <BaseSection>
        {/* 배경 패턴 */}
        <Showbox>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.palette.primary.main}08 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${theme.palette.secondary.main}08 0%, transparent 50%)`,
            }}
          />
        </Showbox>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" sx={{ mb: 10 }}>
            <Showbox display="inline-flex">
              <Chip
                label="강력한 기능들"
                sx={{
                  mb: 3,
                  px: 3,
                  py: 1,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.white.main,
                }}
              />
            </Showbox>

            <Showbox>
              <Typography
                variant="h2"
                sx={{
                  mb: 4,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                누비아만의 특별한 기능들
              </Typography>
            </Showbox>

            <Showbox>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  maxWidth: 700,
                  mx: 'auto',
                  lineHeight: 1.7,
                }}
              >
                단순한 설문 도구를 넘어, 완전히 새로운 설문 경험을 제공합니다.
                <br />
                사용자와 응답자 모두가 만족하는 혁신적인 기능들을 만나보세요.
              </Typography>
            </Showbox>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, idx) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={idx}>
                <Showbox>
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      borderRadius: 4,
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                        borderColor: feature.color,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: feature.color,
                        transform: 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.3s ease',
                      },
                      '&:hover::before': {
                        transform: 'scaleX(1)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                        <Avatar
                          sx={{
                            backgroundColor: `${feature.color}15`,
                            color: feature.color,
                            width: 64,
                            height: 64,
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Chip
                          label={feature.badge}
                          size="small"
                          sx={{
                            backgroundColor: feature.color,
                            color: theme.palette.white.main,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>

                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: theme.palette.text.primary }}>
                        {feature.title}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>

                      <Box>
                        {feature.details.map((detail, detailIdx) => (
                          <Box key={detailIdx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: feature.color,
                                mr: 2,
                                flexShrink: 0,
                              }}
                            />
                            <Typography variant="body2" sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                              {detail}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Showbox>
              </Grid>
            ))}
          </Grid>

          <Showbox>
            <Box
              textAlign="center"
              sx={{
                mt: 10,
                p: 4,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
                border: `1px solid ${theme.palette.primary.main}20`,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                🚀 더 많은 기능이 계속 추가되고 있어요!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                사용자 피드백을 바탕으로 매월 새로운 기능을 업데이트합니다.
              </Typography>
            </Box>
          </Showbox>
        </Container>
      </BaseSection>
    </Box>
  );
}
