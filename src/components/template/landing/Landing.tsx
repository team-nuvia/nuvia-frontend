'use client';

import Loading from '@components/atom/Loading';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { useContext } from 'react';
import Dashboard from '../Dashboard';
import Home from './Home';

interface LandingProps {}
const Landing: React.FC<LandingProps> = () => {
  const { isLoading, isVerified } = useContext(AuthenticationContext);

  if (isLoading) {
    return <Loading />;
  }

  return isVerified ? <Dashboard /> : <Home />;
};

export default Landing;
