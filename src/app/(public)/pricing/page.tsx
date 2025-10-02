import Pricing from '@components/template/Pricing';
import { generatePageMetadata } from '@util/metadata';

export const metadata = generatePageMetadata({
  title: '요금제',
  description: '누비아의 다양한 요금제를 확인하세요. 무료 플랜부터 프리미엄 플랜까지, 비즈니스 규모에 맞는 설문 솔루션을 제공합니다.',
  keywords: ['요금제', '가격', '무료', '프리미엄', '설문 솔루션', '비즈니스'],
  path: '/pricing',
});

interface PageProps {}
const Page: React.FC<PageProps> = () => {
  return <Pricing />;
};

export default Page;
