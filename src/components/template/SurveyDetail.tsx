'use client';

import { GetSurveyDetailResponse } from '@/models/GetSurveyDetailResponse';
import { ValidateFirstAnswerResponse } from '@/models/ValidateFirstAnswerResponse';
import { validateFirstSurveyAnswer } from '@api/validate-first-answer';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import LoadingContext from '@context/LodingContext';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useContext, useLayoutEffect, useState } from 'react';
import ResponseSurvey from './ResponseSurvey';

export default function SurveyDetail({ survey }: { survey: GetSurveyDetailResponse }) {
  const router = useRouter();
  const { addNotice } = useContext(GlobalSnackbarContext);
  const { endLoading } = useContext(LoadingContext);
  const [isFirstAnswer, setIsFirstAnswer] = useState(false);
  const { mutate: validateFirstAnswer } = useMutation<ServerResponse<ValidateFirstAnswerResponse>>({
    mutationFn: () => validateFirstSurveyAnswer(survey.id as number),
    onSuccess: (data) => {
      setIsFirstAnswer(data.payload?.isFirstAnswer ?? false);
      endLoading();
    },
  });

  useLayoutEffect(() => {
    validateFirstAnswer();
  }, []);

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

  if (isFirstAnswer) {
    return <div>설문을 시작하시겠습니까?</div>;
  }

  return <ResponseSurvey survey={surveyDataWithAnswers} />;
}
