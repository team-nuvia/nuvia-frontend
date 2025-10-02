import Terms from '@components/template/Terms';
import { generatePageMetadata } from '@util/metadata';

export const metadata = generatePageMetadata({
  title: '이용약관',
  description: '누비아 서비스 이용약관을 확인하세요. 서비스 이용에 대한 조건과 규정을 명확히 안내합니다.',
  keywords: ['이용약관', '서비스 약관', '이용 조건', '규정'],
  path: '/terms',
});

interface PageProps {}

const Page: React.FC<PageProps> = () => {
  return <Terms />;
};

export default Page;
