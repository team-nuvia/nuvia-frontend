'use client';

import { GetSurveyDetailResponse } from '@/models/GetSurveyDetailResponse';
import ActionButton from '@components/atom/ActionButton';
import { Container, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ExpiredAnswerProps {
  survey: GetSurveyDetailResponse;
}
const ExpiredAnswer: React.FC<ExpiredAnswerProps> = ({ survey }) => {
  const router = useRouter();

  function handleNewAnswer() {
    window.location.href = `/survey/view/${survey.hashedUniqueKey}`;
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Stack gap={3} alignItems="center" justifyContent="center">
        <Typography variant="h4" component="h1" gutterBottom color="text.secondary">
          응답이 만료되었습니다.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          다시 참여하기 위해서는 처음부터 시작해야 합니다.
        </Typography>
        <Stack direction="row" gap={2} justifyContent="center">
          <ActionButton variant="contained" color="primary" onClick={() => router.push('/')}>
            홈으로 이동
          </ActionButton>
          <ActionButton variant="contained" color="primary" onClick={handleNewAnswer}>
            처음부터 시작하기
          </ActionButton>
        </Stack>
      </Stack>
    </Container>
  );
};

export default ExpiredAnswer;
