import queryKeys from '@/store/lib/query-key';
import { getLast7DaysResponseCount } from '@api/survey/get-daily-response-count';
import { getSurveyMetadata } from '@api/survey/get-survey-metadata';
import Dashboard from '@components/template/dashboard/Dashboard';
import { MetadataStatusType } from '@share/enums/metadata-status-type';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function Page() {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.metadata(),
      queryFn: () => getSurveyMetadata(MetadataStatusType.Dashboard),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.graph.dailyResponseCount(),
      queryFn: getLast7DaysResponseCount,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dashboard />
    </HydrationBoundary>
  );
}
