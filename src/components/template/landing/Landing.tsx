'use client';

import { GetMeResponse } from '@/models/GetMeResponse';
import Dashboard from '../Dashboard';
import Home from './Home';

interface LandingProps {
  user: GetMeResponse | null;
}
const Landing: React.FC<LandingProps> = ({ user }) => {
  return user ? <Dashboard /> : <Home />;
};

export default Landing;
