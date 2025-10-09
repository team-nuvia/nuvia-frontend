import queryKeys from '@/store/lib/query-key';
import { getUserOrganizations } from '@api/user/get-user-organizations';
import LoadingScreen from '@components/molecular/LoadingScreen';
import Teams from '@components/template/teams/Teams';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';

interface PageProps {}
const Page: React.FC<PageProps> = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.organization.list(),
    queryFn: getUserOrganizations,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingScreen loadingText="팀 목록 로드 중..." />}>
        <Teams />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
