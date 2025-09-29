'use client';

import CommonText from '@/components/atom/CommonText';
import { Box, Container, Paper, Stack, styled, Typography } from '@mui/material';

const SectionContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
}));

const ColorSection = styled(SectionContainer)<{ color: string }>(({ color }) => ({
  borderLeft: `6px solid ${color}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    transition: 'all 0.3s ease',
  },
}));

const HighlightText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const ProblemList = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  '& > div': {
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    position: 'relative',
    '&::before': {
      content: '"•"',
      position: 'absolute',
      left: 0,
      color: theme.palette.warning.main,
      fontWeight: 'bold',
    },
  },
}));

const FeatureList = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  '& > div': {
    marginBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(2),
    position: 'relative',
    '&::before': {
      content: '"✓"',
      position: 'absolute',
      left: 0,
      color: theme.palette.success.main,
      fontWeight: 'bold',
    },
  },
}));

const About: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack gap={4}>
        {/* 1. Nuvia는 이런 서비스입니다 */}
        <ColorSection color="#00A344">
          <Typography variant="h4" component="h1" gutterBottom thickness="bold" color="primary">
            🟢 Nuvia는 이런 서비스입니다
          </Typography>
          <CommonText variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            설문은 어렵고 복잡하다는 인식을 바꾸고 싶었습니다.
          </CommonText>
          <CommonText variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Nuvia는 간편하게 설문을 만들고, 쉽게 공유하고, 결과를 보기 좋게 보여주는 서비스입니다.
          </CommonText>
          <CommonText variant="body1" sx={{ lineHeight: 1.8 }}>
            회원이 아니어도 설문을 만들 수 있고, 링크 하나로 사람들의 생각을 모을 수 있어요.
          </CommonText>
        </ColorSection>

        {/* 2. 설문, 왜 이렇게 복잡할까요? */}
        <ColorSection color="#F57C00">
          <Typography variant="h4" component="h2" gutterBottom thickness="bold" color="primary">
            🟡 설문, 왜 이렇게 복잡할까요?
          </Typography>
          <CommonText variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            간단히 물어보고 싶었을 뿐인데,
          </CommonText>
          <ProblemList>
            <CommonText variant="body1">가입부터 시작해,</CommonText>
            <CommonText variant="body1">복잡한 설정에,</CommonText>
            <CommonText variant="body1">결과도 내가 원하는 대로 보기 어렵고...</CommonText>
          </ProblemList>
          <CommonText variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            마치 거대한 폼 빌더가 되어버린 설문 시스템들이 많았습니다.
          </CommonText>
          <HighlightText variant="body1">그래서 저희는, 정말 '필요한 만큼만' 제공하는 서비스를 만들기로 했습니다.</HighlightText>
        </ColorSection>

        {/* 3. 그래서 이렇게 만들었어요 */}
        <ColorSection color="#FF9800">
          <Typography variant="h4" component="h3" gutterBottom thickness="bold" color="primary">
            🟠 그래서 이렇게 만들었어요
          </Typography>
          <FeatureList>
            <CommonText variant="body1">질문 몇 개만으로 바로 설문을 만들 수 있어요.</CommonText>
            <CommonText variant="body1">회원가입 없이도 설문을 만들고 공유할 수 있어요.</CommonText>
            <CommonText variant="body1">응답자 수는 기본 20명까지 제공돼요.</CommonText>
            <CommonText variant="body1">결과는 보기 좋게, 이해하기 쉽게 정리돼요.</CommonText>
          </FeatureList>
          <CommonText variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            필요한 건 심플하고, 명확한 흐름이었습니다.
          </CommonText>
          <HighlightText variant="body1">Nuvia는 "복잡함 없이, 설문 본연에 집중" 할 수 있도록 만들어졌습니다.</HighlightText>
        </ColorSection>

        {/* 4. 우리는 이렇게 만들고 싶었습니다 */}
        <ColorSection color="#2196F3">
          <Typography variant="h4" component="h4" gutterBottom thickness="bold" color="primary">
            🟣 우리는 이렇게 만들고 싶었습니다
          </Typography>
          <FeatureList>
            <CommonText variant="body1">응답 데이터는 우리가 소중히 다룹니다.</CommonText>
            <CommonText variant="body1">통계와 시각화는 왜곡 없이 보여드립니다.</CommonText>
            <CommonText variant="body1">설문을 만드는 사람, 응답하는 사람 모두를 위한 경험을 만들고자 했습니다.</CommonText>
          </FeatureList>
          <CommonText variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Nuvia는 설문 데이터를 단순히 '모으는 도구'가 아니라
          </CommonText>
          <HighlightText variant="h6" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
            **'소통을 위한 기반'**으로 생각합니다.
          </HighlightText>
        </ColorSection>

        {/* 5. 조금씩 나아가겠습니다 */}
        <ColorSection color="#9C27B0">
          <Typography variant="h4" component="h5" gutterBottom thickness="bold" color="primary">
            🟣 조금씩 나아가겠습니다
          </Typography>
          <CommonText variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            지금은 작은 도구일지 몰라도, 쌓인 데이터는 언젠가 공공이나 연구기관에게 도움이 될 수도 있습니다.
          </CommonText>
          <CommonText variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            저희는 사용자의 동의 하에, 데이터를 의미 있는 분석에 활용할 수 있는 플랫폼으로 확장하려고 합니다.
          </CommonText>
          <CommonText variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            아직은 실험적인 걸음이지만, 쓰는 사람에게 실질적인 도움이 되는 서비스를 만들고 싶습니다.
          </CommonText>
        </ColorSection>

        {/* 6. 만든 사람에 대하여 */}
        <ColorSection color="#757575">
          <Typography variant="h4" component="h6" gutterBottom thickness="bold" color="primary">
            ⚪ 만든 사람에 대하여
          </Typography>
          <CommonText variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Nuvia는 혼자서 개발하고, 기획하고, 디자인하며 만들어가는 프로젝트입니다.
          </CommonText>
          <CommonText variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            서비스라는 게 꼭 거창해야 하는 건 아니니까요. 작은 불편함을 해소하는 것부터 시작해 보았습니다.
          </CommonText>
          <CommonText variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            피드백은 언제든 환영이에요. 함께 만들어주세요.
          </CommonText>
        </ColorSection>
      </Stack>
    </Container>
  );
};

export default About;
