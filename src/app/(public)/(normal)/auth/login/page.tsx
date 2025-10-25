import Login from '@components/template/auth/Login';
import { generatePageMetadata } from '@util/metadata';
import { Suspense } from 'react';

export const metadata = generatePageMetadata({
  title: '로그인',
  description: '누비아에 로그인하여 설문을 생성하고 관리하세요. 간편한 로그인으로 설문 제작을 시작해보세요.',
  keywords: ['로그인', '회원가입', '설문 제작', '온라인 설문'],
  path: '/auth/login',
});

interface PageProps {}
const Page: React.FC<PageProps> = async () => {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
};

export default Page;
