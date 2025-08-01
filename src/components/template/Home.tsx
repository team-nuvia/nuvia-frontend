'use client';

import CommonButton from '@components/atom/CommonButton';
import CommonText from '@components/atom/CommonText';
import Showbox from '@components/atom/Showbox';
import ReviewCard from '@components/organism/ReviewCard';
import SolutionCard from '@components/organism/SolutionCard';
import { Analytics, Ballot, BarChart, Create, LockOpen, PersonAdd, PhotoCamera, Share, Timer } from '@mui/icons-material';
import { Grid, Stack, useTheme } from '@mui/material';

interface HomeProps {}

const IntroSection = () => {
  return (
    <Stack gap={4} alignItems="center" py={10} px={5}>
      {/* TODO: CommonText 등으로 대제목, 소제목, 일러스트 카드 */}
      <Showbox>
        <CommonText variant="h3" align="center" thickness="bold" gutterBottom>
          설문, 가볍게 만들 수 있다면 얼마나 좋을까요?
        </CommonText>
      </Showbox>
      <Showbox>
        <CommonText align="center" color="text.secondary">
          질문 하나로 시작되는 대화, 더 쉽게 만들 수 있다면?
        </CommonText>
      </Showbox>
      <Showbox>
        <CommonText align="center" color="text.secondary">
          📊 복잡한 설문 도구 일러스트
        </CommonText>
      </Showbox>
    </Stack>
  );
};

const FeatureSection = () => {
  const theme = useTheme();

  const steps = [
    {
      icon: <Create sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: '설문 만들기',
      description: '직관적인 인터페이스로 빠르게 설문을 생성하세요',
    },
    {
      icon: <Share sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: '공유하기',
      description: '링크 하나로 어디든 간편하게 공유할 수 있어요',
    },
    {
      icon: <Analytics sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: '통계 보기',
      description: '실시간으로 응답을 확인하고 분석하세요',
    },
  ];

  return (
    <Stack gap={4} alignItems="center" py={10} px={5}>
      {/* TODO: CommonText, StatisticsCard, SettingItem 등으로 3가지 카드 */}
      <Showbox>
        <CommonText variant="h3" align="center" thickness="bold" gutterBottom>
          누비아는 설문을 더 쉽고, 더 빠르게 만듭니다
        </CommonText>
      </Showbox>
      <Showbox>
        <CommonText align="center" color="text.secondary">
          질문하고, 공유하고, 결과를 받는 일 — 단 5분이면 충분합니다.
        </CommonText>
      </Showbox>
      <Stack direction="row" gap={3} justifyContent="center">
        {steps.map((step, idx) => (
          <Showbox key={idx} flex={1}>
            <SolutionCard icon={step.icon} title={step.title} description={step.description} direction="column" />
          </Showbox>
        ))}
      </Stack>
    </Stack>
  );
};

const SpecialFeatureSection = () => {
  const theme = useTheme();

  const items = [
    {
      icon: <PhotoCamera sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: '이미지 응답 지원',
      desc: '텍스트뿐만 아니라 이미지로도 응답받을 수 있어요 📸',
    },
    {
      icon: <LockOpen sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: '비회원 설문 가능',
      desc: '로그인 없이도 바로 시작할 수 있어요 🔓',
    },
    {
      icon: <Timer sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: '응답 제한 기능',
      desc: '응답 수 제한도 직접 설정할 수 있어요',
    },
    {
      icon: <BarChart sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: '통계 자동 시각화',
      desc: '설문 결과, 자동으로 정리해드릴게요 📊',
    },
  ];

  return (
    <Stack gap={4} py={10} px={5}>
      {/* TODO: 4가지 특별 기능 카드 */}
      <Showbox>
        <CommonText variant="h3" align="center" thickness="bold" gutterBottom>
          누비아만의 특별한 기능들
        </CommonText>
      </Showbox>
      <Stack gap={3} flexWrap="wrap">
        {items.map((item, idx) => (
          <Showbox key={idx} width="100%">
            <SolutionCard icon={item.icon} title={item.title} description={item.desc} direction="row" />
          </Showbox>
        ))}
      </Stack>
    </Stack>
  );
};

const ReviewSection = () => {
  const data = [
    {
      txt: '설문 하나 만드는데 5분도 안 걸렸어요! 정말 간단하고 직관적이에요.',
      who: '스타트업 PM 유정*',
      av: 'Y',
    },
    {
      txt: '예쁘고 기능도 좋아요!',
      who: '프리랜서 디자이너 김효*',
      av: 'K',
    },
    {
      txt: '비회원도 쉽게 참여할 수 있어서 응답률이 확실히 높아졌어요.',
      who: '마케터 이수*',
      av: 'L',
    },
  ];

  return (
    <Stack gap={4} alignItems="center" py={10} px={5}>
      {/* TODO: ReviewCard 컴포넌트로 후기 4개 */}
      <Showbox>
        <CommonText variant="h3" align="center" thickness="bold" gutterBottom>
          사용자들의 생생한 후기
        </CommonText>
      </Showbox>
      <Grid container spacing={4}>
        {data.map((t, idx) => (
          <Grid key={idx} size={{ xs: 2, sm: 4, md: 4 }}>
            <Showbox>
              <ReviewCard {...t} />
            </Showbox>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

const CTASection = () => {
  const theme = useTheme();
  return (
    <Stack
      gap={3}
      alignItems="center"
      py={10}
      px={5}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      }}
    >
      {/* TODO: CommonText, CommonButton 2개 */}
      <CommonText color="white" variant="h4">
        지금, 당신만의 설문을 만들어보세요
      </CommonText>
      <CommonText color="white" variant="body2">
        5분이면 충분합니다. 지금 바로 시작해보세요!
      </CommonText>
      <Stack direction="row" gap={2}>
        <CommonButton variant="contained" size="large" color="white" sx={{ color: (theme) => theme.palette.primary.main }} startIcon={<Ballot />}>
          비회원으로 설문 만들기 시작하기
        </CommonButton>
        <CommonButton variant="outlined" size="large" color="white" startIcon={<PersonAdd />}>
          회원가입하고 통계 분석까지 받아보세요
        </CommonButton>
      </Stack>
    </Stack>
  );
};

const Home: React.FC<HomeProps> = () => {
  return (
    <Stack flex={1} gap={10}>
      <IntroSection />
      <FeatureSection />
      <SpecialFeatureSection />
      <ReviewSection />
      <CTASection />
    </Stack>
  );
};

export default Home;
