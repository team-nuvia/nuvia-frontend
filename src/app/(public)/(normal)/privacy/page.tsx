import Privacy from '@components/template/Privacy';
import { generatePageMetadata } from '@util/metadata';

export const metadata = generatePageMetadata({
  title: '개인정보처리방침',
  description: '누비아의 개인정보처리방침을 확인하세요. 사용자의 개인정보 보호와 데이터 처리에 대한 투명한 정책을 제공합니다.',
  keywords: ['개인정보처리방침', '개인정보 보호', '데이터 보안', '프라이버시'],
  path: '/privacy',
});

interface PageProps {}

const Page: React.FC<PageProps> = () => {
  return <Privacy />;
};

export default Page;
