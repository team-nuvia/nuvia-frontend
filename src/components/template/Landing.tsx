'use client';

import { AuthenticationContext } from '@context/AuthenticationContext';
import LoadingContext from '@context/LodingContext';
import { isNil } from '@util/isNil';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import Dashboard from './Dashboard';
import Home from './Home';

interface LandingProps {}
const Landing: React.FC<LandingProps> = () => {
  const router = useRouter();
  const { user } = useContext(AuthenticationContext);
  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    const hasUser = !isNil(user);
    setLoading(true, '로딩중...');
    if (!hasUser) {
      router.push('/auth/login');
    }
    setLoading(false);
  }, []);

  if (isNil(user)) {
    return <Home />;
  }

  return <Dashboard />;
};

export default Landing;
