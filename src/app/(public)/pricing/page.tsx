import queryKeys from '@/store/lib/query-key';
import { getPlans } from '@api/plan/get-plans';
import LoadingScreen from '@components/molecular/LoadingScreen';
import Pricing from '@components/template/Pricing';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { generatePageMetadata } from '@util/metadata';
import { Suspense } from 'react';

export const metadata = generatePageMetadata({
  title: '요금제',
  description: '누비아의 다양한 요금제를 확인하세요. 무료 플랜부터 프리미엄 플랜까지, 비즈니스 규모에 맞는 설문 솔루션을 제공합니다.',
  keywords: ['요금제', '가격', '무료', '프리미엄', '설문 솔루션', '비즈니스'],
  path: '/pricing',
});

interface PageProps {}
const Page: React.FC<PageProps> = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.plan.list(),
    queryFn: getPlans,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingScreen loadingText="요금제 로드 중..." />}>
        <Pricing />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
