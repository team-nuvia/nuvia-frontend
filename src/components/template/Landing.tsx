'use client';

import { AuthenticationContext } from '@context/AuthenticationContext';
import { isNil } from '@util/isNil';
import { useContext } from 'react';
import Dashboard from './Dashboard';
import Home from './Home';

interface LandingProps {}
const Landing: React.FC<LandingProps> = () => {
  const { user } = useContext(AuthenticationContext);

  if (isNil(user)) {
    return <Home />;
  }

  return <Dashboard />;
};

export default Landing;
