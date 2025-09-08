'use client';

import { AuthenticationContext } from '@context/AuthenticationContext';
import { useContext } from 'react';
import Dashboard from '../Dashboard';
import Home from './Home';

interface LandingProps {}
const Landing: React.FC<LandingProps> = () => {
  const { user } = useContext(AuthenticationContext);

  if (user) {
    return <Dashboard />;
  }

  return <Home />;
};

export default Landing;
