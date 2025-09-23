'use client';

import CommonButton from '@components/atom/CommonButton';
import CommonText from '@components/atom/CommonText';
import LinkText from '@components/atom/LinkText';
import { AnalysisOverviewCards } from '@components/molecular/AnalysisOverviewCards';
import BrandHead from '@components/molecular/BrandHead';
import Preview from '@components/organism/Preview';
import { Analytics, BarChart, Create, Download, Share } from '@mui/icons-material';
import { Box, Card, CardContent, Container, Divider, Grid, Stack, useTheme } from '@mui/material';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { SurveyStatus } from '@share/enums/survey-status';
import Image from 'next/image';

/**
 * Landing Page (unauthenticated)
 * - Mirrors the wireframe shared in chat
 * - Uses existing atoms/molecular/organism components
 * - MUI v7 compatible (no deprecated APIs)
 */

const HeroSection = () => {
  const theme = useTheme();
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2}>
              <CommonText variant="overline" color="primary" sx={{ letterSpacing: 1.2 }}>
                SURVEY · RESEARCH · INSIGHTS
              </CommonText>
              <CommonText variant="h3" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                당신의 질문이, 사회의 데이터가 됩니다.
              </CommonText>
              <CommonText variant="body1" color="text.secondary">
                설문 생성 → 응답 수집 → 상관분석 대시보드. Nuvia가 리서치를 자동화합니다.
              </CommonText>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={1}>
                <CommonButton variant="contained" size="large" href="/auth/signup">
                  지금 무료로 시작하기
                </CommonButton>
                <CommonButton variant="outlined" size="large" href="/sample-report">
                  샘플 리포트 보기
                </CommonButton>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              {/* Dashboard Preview Placeholder (replace with real image if available) */}
              <Image src={'/sample.png'} alt="Nuvia 대시보드 미리보기" width={450} height={330} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const SocialProof = () => (
  <Box component="section" sx={{ py: 4 }}>
    <Container maxWidth="lg">
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={3}>
        <BrandHead title="Nuvia" width={36} height={36} primaryColor={'#565656'} secondaryColor={'#787878'} />
        <Divider flexItem orientation="vertical" />
        <CommonText variant="body2" color="text.secondary">
          투명한 데이터 기준 · 익명 참여 보장 · 결과 공개 기준 제공
        </CommonText>
      </Stack>
    </Container>
  </Box>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card sx={{ height: '100%', borderRadius: 3 }}>
    <CardContent>
      <Stack spacing={1.5}>
        <Box>{icon}</Box>
        <CommonText variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </CommonText>
        <CommonText variant="body2" color="text.secondary">
          {description}
        </CommonText>
      </Stack>
    </CardContent>
  </Card>
);

const FeaturesSection = () => {
  const theme = useTheme();
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FeatureCard icon={<Create sx={{ fontSize: 42 }} />} title="빠른 설문 제작" description="템플릿과 직관적 UI로 5분 만에 설문 배포" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FeatureCard
              icon={<Analytics sx={{ fontSize: 42 }} />}
              title="상관분석 대시보드"
              description="응답자 특성/문항 상관관계를 자동으로 시각화"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FeatureCard icon={<Download sx={{ fontSize: 42 }} />} title="데이터 내보내기" description="CSV/JSON으로 결과를 내려받아 2차 분석" />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const HowItWorksSection = () => (
  <Box component="section" sx={{ py: { xs: 8, md: 10 }, backgroundColor: 'background.default' }}>
    <Container maxWidth="lg">
      <CommonText variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
        어떻게 작동하나요?
      </CommonText>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FeatureCard icon={<Create />} title="1. 설문 만들기" description="맞춤형 질문으로 설문 구성" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FeatureCard icon={<Share />} title="2. 공유/참여" description="링크/QR로 손쉽게 배포" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FeatureCard icon={<BarChart />} title="3. 인사이트" description="대시보드에서 상관분석 확인" />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const GallerySection = () => (
  <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
    <Container maxWidth="lg">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <CommonText variant="h5" sx={{ fontWeight: 800 }}>
          설문 갤러리 미리보기
        </CommonText>
        <LinkText to="/gallery" variant="body2">
          더 보기 →
        </LinkText>
      </Stack>
      {/* Placeholder using existing Preview organism */}
      <Preview
        isBind
        isDemo
        handleClose={() => {}}
        survey={{
          id: 1,
          hashedUniqueKey: '1234567890',
          subscriptionId: 1,
          category: {
            id: 1,
            name: '직업/적성',
          },
          title: '직업 적성 탐색 설문',
          description:
            '본인의 성향과 관심사를 파악하여 적합한 직업 분야를 찾아보는 설문입니다. 총 10개의 질문으로 구성되어 있으며, 완료 후 개인 맞춤형 직업 추천을 받을 수 있습니다.',
          author: {
            id: 1,
            name: '김진수',
            profileUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
          },
          estimatedTime: 10,
          questionAnswers: [],
          questions: [
            {
              id: 1,
              idx: 1,
              sequence: 1,
              title: '가장 흥미를 느끼는 업무 영역은 무엇인가요?',
              description: '본인의 성향과 관심사에 가장 부합하는 분야를 선택해주세요.',
              questionType: QuestionType.SingleChoice,
              dataType: DataType.Text,
              isRequired: true,
              questionOptions: [
                { id: 1, idx: 1, sequence: 1, label: '기획/전략 수립' },
                { id: 2, idx: 2, sequence: 2, label: '창작/디자인' },
                { id: 3, idx: 3, sequence: 3, label: '개발/기술' },
                { id: 4, idx: 4, sequence: 4, label: '영업/마케팅' },
                { id: 5, idx: 5, sequence: 5, label: '분석/연구' },
                { id: 6, idx: 6, sequence: 6, label: '관리/운영' },
              ],
              questionAnswers: new Map(),
            },
            {
              id: 2,
              idx: 2,
              sequence: 2,
              title: '팀 프로젝트에서 어떤 역할을 선호하시나요?',
              description: '평소 협업 상황에서 선호하는 역할이나 포지션을 알려주세요.',
              questionType: QuestionType.ShortText,
              dataType: DataType.Text,
              isRequired: true,
              questionOptions: [],
              questionAnswers: new Map(),
            },
            {
              id: 3,
              idx: 3,
              sequence: 3,
              title: '본인의 커리어 목표는 무엇인가요?',
              description: '5-10년 후 달성하고 싶은 직업적 목표나 비전을 자유롭게 작성해주세요.',
              questionType: QuestionType.ShortText,
              dataType: DataType.Text,
              isRequired: true,
              questionOptions: [],
              questionAnswers: new Map(),
            },
          ],
          isPublic: true,
          status: SurveyStatus.Active,
          questionCount: 10,
          respondentCount: 10,
          viewCount: 10,
          totalResponses: 10,
          isOwner: true,
          expiresAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
      />
    </Container>
  </Box>
);

const SampleReportSection = () => (
  <Box component="section" sx={{ py: { xs: 8, md: 10 }, backgroundColor: 'background.paper' }}>
    <Container maxWidth="lg">
      <Grid container spacing={3} alignItems="center">
        <Grid size={{ xs: 12, md: 8 }}>
          <CommonText variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Z세대 소비 성향 리포트 (미리보기)
          </CommonText>
          <CommonText variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            실제 예시 리포트로 Nuvia의 분석 품질을 확인해 보세요.
          </CommonText>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <CommonButton variant="contained" href="/sample-report">
              리포트 보기
            </CommonButton>
            <CommonButton variant="text" href="/pricing">
              가격 보기
            </CommonButton>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <AnalysisOverviewCards loading />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const PricingSection = () => (
  <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
    <Container maxWidth="lg">
      <CommonText variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
        간단한 구독으로 시작하세요
      </CommonText>
      <Grid container spacing={3}>
        {[
          { name: 'Free', desc: '월 X개 설문 생성', cta: '무료로 시작' },
          { name: 'Pro', desc: '월 X개↑ · 고급 분석', cta: '시작하기' },
          { name: 'Team', desc: '협업 · 권한 · SSO', cta: '문의하기' },
        ].map((tier) => (
          <Grid size={{ xs: 12, md: 4 }} key={tier.name}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent>
                <Stack spacing={1.25}>
                  <CommonText variant="h6" sx={{ fontWeight: 700 }}>
                    {tier.name}
                  </CommonText>
                  <CommonText variant="body2" color="text.secondary">
                    {tier.desc}
                  </CommonText>
                  <CommonButton variant={tier.name === 'Pro' ? 'contained' : 'outlined'} href="/pricing">
                    {tier.cta}
                  </CommonButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

const CTASection = () => (
  <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
    <Container maxWidth="lg">
      <Stack alignItems="center" spacing={2}>
        <CommonText variant="h5" sx={{ fontWeight: 800 }}>
          지금 바로 설문을 시작해 보세요.
        </CommonText>
        <CommonButton size="large" variant="contained" href="/auth/signup">
          무료로 시작하기
        </CommonButton>
      </Stack>
    </Container>
  </Box>
);

const Home: React.FC = () => {
  return (
    <Stack flex={1} minHeight="100dvh" sx={{ backgroundColor: 'background.default' }}>
      <HeroSection />
      <SocialProof />
      <FeaturesSection />
      <HowItWorksSection />
      <GallerySection />
      <SampleReportSection />
      <PricingSection />
      <CTASection />
    </Stack>
  );
};

export default Home;
