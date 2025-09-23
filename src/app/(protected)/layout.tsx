import { getUserInformation } from '@api/server/get-user-information';
import Footer from '@components/organism/Footer';
import Header from '@components/organism/Header';
import Sidebar from '@components/organism/Sidebar';
import { Stack } from '@mui/material';
import { redirect } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const user = await getUserInformation();
  // console.log('🚀 ~ Protected Layout ~ user:', user);

  if (!user) {
    redirect('/');
  }

  return (
    <Stack id="wrap" flex={1} sx={{ position: 'relative' }}>
      <Header />
      <Stack direction="row" flex={1}>
        <Sidebar />
        <Stack flex={1} sx={{ overflowX: 'hidden' }}>
          {children}
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  );
};

export default Layout;
