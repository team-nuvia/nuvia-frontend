'use client';

import { GetPlansModel } from '@/models/GetPlansModel';
import queryKeys from '@/store/lib/query-key';
import { getPlans } from '@api/plan/get-plans';
import { Check, Star } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, Container, Grid, Typography, useTheme } from '@mui/material';
import { PlanNameType } from '@share/enums/plan-name-type.enum';
import { useQuery } from '@tanstack/react-query';
import { LocalizationManager } from '@util/LocalizationManager';
import { useState } from 'react';

// interface PricingPlan {
//   id: string;
//   name: string;
//   price: number;
//   period: 'monthly' | 'yearly';
//   description: string;
//   features: string[];
//   isPopular?: boolean;
//   isFree?: boolean;
//   buttonText: string;
//   buttonDisabled?: boolean;
// }

interface PricingProps {}
const Pricing: React.FC<PricingProps> = () => {
  const theme = useTheme();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { data: plansResponse } = useQuery<ServerResponse<GetPlansModel[]>>({
    queryKey: queryKeys.plan.list(),
    queryFn: getPlans,
  });

  const plans = plansResponse?.payload ?? [];
  // 임시 데이터 - 서버에서 받아올 예정
  // const plans: PricingPlan[] = [
  //   {
  //     id: 'free',
  //     name: 'Free',
  //     price: 0,
  //     period: 'monthly',
  //     description: '개인 사용자를 위한 기본 기능',
  //     features: ['월 100개 응답까지', '기본 설문 템플릿', '모바일 최적화', '기본 데이터 분석', '이메일 지원'],
  //     isFree: true,
  //     buttonText: '무료로 시작하기',
  //     buttonDisabled: false,
  //   },
  //   {
  //     id: 'pro',
  //     name: 'Pro',
  //     price: billingPeriod === 'monthly' ? 29 : 290,
  //     period: billingPeriod,
  //     description: '소규모 팀을 위한 고급 기능',
  //     features: ['월 5,000개 응답까지', '고급 설문 템플릿', 'AI 기반 분석', '조직 협업 기능', '우선 지원', '커스텀 브랜딩'],
  //     isPopular: true,
  //     buttonText: '준비중',
  //     buttonDisabled: true,
  //   },
  //   {
  //     id: 'enterprise',
  //     name: 'Enterprise',
  //     price: billingPeriod === 'monthly' ? 99 : 990,
  //     period: billingPeriod,
  //     description: '대규모 조직을 위한 완전한 솔루션',
  //     features: ['무제한 응답', '모든 템플릿', '고급 AI 분석', '전담 계정 관리', '24/7 전화 지원', 'API 접근', 'SSO 통합'],
  //     buttonText: '준비중',
  //     buttonDisabled: true,
  //   },
  // ];

  const formatPrice = (price: number) => {
    if (price === 0) return '무료';
    return `₩${price.toLocaleString()}`;
  };

  const getPeriodText = (period: 'monthly' | 'yearly') => {
    return period === 'monthly' ? '/월' : '/년';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* 헤더 섹션 */}
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            간단하고 투명한 가격
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            모든 기능을 무료로 체험해보세요. 필요에 따라 언제든지 업그레이드할 수 있습니다.
          </Typography>

          {/* 결제 주기 토글 */}
          <Box
            sx={{
              display: 'inline-flex',
              bgcolor: theme.palette.background.paper,
              borderRadius: 2,
              p: 0.5,
              border: `1px solid ${theme.palette.divider}`,
              mb: 6,
            }}
          >
            <Button
              variant={billingPeriod === 'monthly' ? 'contained' : 'text'}
              onClick={() => setBillingPeriod('monthly')}
              sx={{
                borderRadius: 1.5,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 100,
              }}
            >
              월간
            </Button>
            <Button
              variant={billingPeriod === 'yearly' ? 'contained' : 'text'}
              onClick={() => setBillingPeriod('yearly')}
              sx={{
                borderRadius: 1.5,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 100,
              }}
            >
              연간
              <Chip
                label="20% 할인"
                size="small"
                sx={{
                  ml: 1,
                  bgcolor: theme.palette.success.main,
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            </Button>
          </Box>
        </Box>

        {/* 가격 카드들 */}
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan) => (
            <Grid size={{ xs: 12, md: 12 / plans.length }} key={plan.id}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  border: plan.name === PlanNameType.Basic ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px rgba(61, 90, 254, 0.15)`,
                  },
                }}
              >
                {/* 인기 배지 */}
                {plan.name === PlanNameType.Basic && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 1,
                    }}
                  >
                    <Chip
                      icon={<Star sx={{ fontSize: 16 }} />}
                      label="가장 인기"
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 600,
                        px: 2,
                      }}
                    />
                  </Box>
                )}

                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* 플랜 이름과 설명 */}
                  <Box textAlign="center" mb={3}>
                    <Typography variant="h5" fontWeight={700} mb={1}>
                      {LocalizationManager.translate(plan.name)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.description}
                    </Typography>
                  </Box>

                  {/* 가격 */}
                  <Box textAlign="center" mb={4}>
                    <Typography
                      variant="h3"
                      fontWeight={700}
                      sx={{
                        color: plan.name === PlanNameType.Free ? theme.palette.success.main : theme.palette.primary.main,
                        mb: 1,
                      }}
                    >
                      {formatPrice(plan.price)}
                    </Typography>
                    {plan.name !== PlanNameType.Free && (
                      <Typography variant="body2" color="text.secondary">
                        {getPeriodText(plan.period)}
                      </Typography>
                    )}
                  </Box>

                  {/* 기능 목록 */}
                  <Box flexGrow={1} mb={4}>
                    {plan.features.map((feature, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                          py: 0.5,
                        }}
                      >
                        <Check
                          sx={{
                            color: theme.palette.success.main,
                            fontSize: 20,
                            mr: 2,
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2" color="text.primary">
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* 버튼 */}
                  <Button
                    variant={plan.name === PlanNameType.Basic ? 'contained' : 'outlined'}
                    fullWidth
                    size="large"
                    disabled={plan.name !== PlanNameType.Free}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      ...(plan.name === PlanNameType.Basic && {
                        bgcolor: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                        },
                      }),
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 하단 안내 문구 */}
        <Box textAlign="center" mt={8}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            모든 플랜에는 14일 무료 체험이 포함됩니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            추가 질문이 있으시면{' '}
            <Typography
              component="span"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              고객 지원팀
            </Typography>
            에게 문의해주세요
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Pricing;
