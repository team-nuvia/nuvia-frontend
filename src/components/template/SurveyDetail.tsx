'use client';

import { GetSurveyDetailResponse } from '@/models/GetSurveyDetailResponse';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import LoadingContext from '@context/LodingContext';
import { useRouter } from 'next/navigation';
import { useContext, useLayoutEffect } from 'react';
import ResponseSurvey from './ResponseSurvey';

export default function SurveyDetail({ survey }: { survey: GetSurveyDetailResponse }) {
  const router = useRouter();
  const { addNotice } = useContext(GlobalSnackbarContext);
  const { endLoading } = useContext(LoadingContext);

  useLayoutEffect(() => {
    endLoading();
  }, []);

  // const {
  //   data: surveyData,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ['surveyDetail', hash],
  //   queryFn: () => getSurveyDetailView(hash ?? ''),
  //   enabled: !!hash,
  // });

  // useLayoutEffect(() => {
  //   if (!isLoading && surveyData) {
  //     setTimeout(() => {
  //       endLoading();
  //     }, 500);
  //   }
  //   if (error) {
  //     const axiosError = error as AxiosError<ServerResponse<void>>;
  //     addNotice(axiosError?.response?.data?.message ?? '설문을 찾을 수 없습니다.', 'error');
  //     endLoading();
  //   }
  // }, [isLoading, surveyData, error, endLoading, addNotice]);

  // if (!surveyData || !surveyData.payload) {
  //   return (
  //     <Box
  //       sx={{
  //         display: 'flex',
  //         flexDirection: 'column',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         minHeight: '60vh',
  //         textAlign: 'center',
  //         p: 4,
  //       }}
  //     >
  //       <Typography variant="h4" component="h1" gutterBottom color="text.secondary">
  //         설문을 찾을 수 없습니다.
  //       </Typography>
  //       <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
  //         요청하신 설문이 존재하지 않거나 접근할 수 없는 상태입니다.
  //       </Typography>
  //       <ActionButton variant="contained" color="primary" onClick={() => router.push('/')}>
  //         홈으로 돌아가기
  //       </ActionButton>
  //     </Box>
  //   );
  // }

  const surveyDataWithAnswers = {
    ...survey,
    questions: survey.questions.map((question, idx) => ({
      ...question,
      idx: Date.now() + idx,
      questionOptions: question.questionOptions?.map((option, idx) => ({ ...option, idx: Date.now() + idx })),
      answers: new Map(),
      isAnswered: false,
    })),
  };

  return <ResponseSurvey survey={surveyDataWithAnswers} />;
}
