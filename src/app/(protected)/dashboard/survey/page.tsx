import queryKeys from '@/store/lib/query-key';
import { getDashboardRecentSurveysServer } from '@api/survey/get-dashboard-recent-surveys-server';
import { getSurveyList } from '@api/survey/get-survey-list';
import { getSurveyMetadata } from '@api/survey/get-survey-metadata';
import LoadingScreen from '@components/molecular/LoadingScreen';
import SurveyList from '@components/template/survey/SurveyList';
import { MetadataStatusType } from '@share/enums/metadata-status-type';
import { SurveyStatusList } from '@share/enums/survey-status';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';

export default async function Page() {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.survey.list(),
      queryFn: () =>
        getSurveyList({
          page: 1,
          limit: 10,
          search: '',
          status: SurveyStatusList.join(','),
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.survey.metadata(),
      queryFn: () => getSurveyMetadata(MetadataStatusType.SurveyList),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.recentSurvey(),
      queryFn: getDashboardRecentSurveysServer,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingScreen loadingText="설문 목록 로드 중..." />}>
        <SurveyList />
      </Suspense>
    </HydrationBoundary>
  );
}
