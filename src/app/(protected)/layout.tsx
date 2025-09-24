import Footer from '@components/organism/Footer';
import Header from '@components/organism/Header';
import Sidebar from '@components/organism/Sidebar';
import { Stack } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = async ({ children }) => {
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
