'use client';

import { GetPlansModel } from '@/models/GetPlansModel';
import { useAuthStore } from '@/store/auth.store';
import queryKeys from '@/store/lib/query-key';
import { getPlans } from '@api/plan/get-plans';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import { Check, Star } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Typography, useTheme } from '@mui/material';
import { PlanNameType } from '@share/enums/plan-name-type.enum';
import { useSuspenseQuery } from '@tanstack/react-query';
import { LocalizationManager } from '@util/LocalizationManager';
import { useContext, useState } from 'react';

interface PricingProps {}
const Pricing: React.FC<PricingProps> = () => {
  const theme = useTheme();
  const router = useAuthStore((state) => state.router)!;
  const { handleOpenDialog } = useContext(GlobalDialogContext);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { data: plansResponse } = useSuspenseQuery<ServerResponse<GetPlansModel[]>>({
    queryKey: queryKeys.plan.list(),
    queryFn: getPlans,
  });

  const plans = plansResponse?.payload ?? [];

  const formatPrice = (price: number) => {
    if (price === 0) return '무료';
    return `₩${Math.floor(price).toLocaleString()}`;
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
                  overflow: 'visible',
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
                {/* TODO: 서버에서 구독 데이터 집계 후 인기 판별 데이터 내려주기 */}
                {/* 인기 배지 */}
                {plan.name === PlanNameType.Basic && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -16.5,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 1,
                    }}
                  >
                    <Chip
                      icon={<Star sx={{ fontSize: 16 }} color="warning" />}
                      label="가장 인기"
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.white.main,
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
                    {billingPeriod === 'yearly' && plan.price !== 0 && (
                      <Stack direction="row" alignItems="center" justifyContent="center" gap={1} mb={1}>
                        <Stack direction="row" alignItems="center" justifyContent="center" gap={1} position="relative" borderRadius="100%">
                          <Box
                            position="absolute"
                            width={60}
                            height={1}
                            top="100%"
                            left="50%"
                            sx={{
                              transform: 'translate(-50%, -50%) rotate(-12deg)',
                              borderTopStyle: 'solid',
                              borderTopWidth: 2,
                              borderTopColor: theme.palette.error.main,
                            }}
                          />
                          <Typography variant="caption" fontWeight={700} sx={{ color: theme.palette.black.light }}>
                            {formatPrice(plan.price * 12)}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" fontWeight={700} sx={{ color: theme.palette.error.light }}>
                          -20%
                        </Typography>
                      </Stack>
                    )}

                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{
                        color: plan.name === PlanNameType.Free ? theme.palette.success.main : theme.palette.primary.main,
                        mb: 1,
                      }}
                    >
                      {/* TODO: 서버에서 연간 할인 적용 및 discount 적용 */}
                      {formatPrice(billingPeriod === 'monthly' ? plan.price : plan.price * 12 * 0.8)}
                    </Typography>
                    {plan.name !== PlanNameType.Free && (
                      <Typography variant="body2" color="text.secondary">
                        {getPeriodText(billingPeriod === 'monthly' ? plan.period : 'yearly')}
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
                    onMouseEnter={() => {
                      if (plan.name !== PlanNameType.Free) {
                        router.prefetch('/auth/login');
                      }
                    }}
                    onClick={() => {
                      if (plan.name === PlanNameType.Free) {
                        router.push('/auth/login');
                      } else {
                        handleOpenDialog({
                          title: `${LocalizationManager.translate(plan.name)} 플랜 구독`,
                          content: '플랜 구독 기능은 준비 중입니다.',
                          type: 'warning',
                          confirmText: '구독하기',
                        });
                      }
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
          {/* <Typography variant="body2" color="text.secondary" mb={2}>
            모든 플랜에는 14일 무료 체험이 포함됩니다
          </Typography> */}
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
