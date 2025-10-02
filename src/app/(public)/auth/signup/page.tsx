import Signup from '@components/template/auth/Signup';
import { generatePageMetadata } from '@util/metadata';

export const metadata = generatePageMetadata({
  title: '회원가입',
  description: '누비아에 무료로 가입하고 전문적인 설문을 만들어보세요. 간편한 회원가입으로 설문 제작을 시작하세요.',
  keywords: ['회원가입', '무료 가입', '설문 제작', '온라인 설문'],
  path: '/auth/signup',
});

interface PageProps {}
const Page: React.FC<PageProps> = () => {
  return <Signup />;
};

export default Page;
