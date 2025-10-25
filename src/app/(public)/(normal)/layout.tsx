import Versioning from '@components/atom/Versioning';
import Footer from '@components/organism/Footer';
import Header from '@components/organism/Header';
import { Stack } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = async ({ children }) => {
  return (
    <Stack id="wrap" flex={1} sx={{ position: 'relative' }}>
      <Versioning sx={{ top: 67, left: 10 }} />
      <Header />
      <Stack direction="row" flex={1}>
        <Stack flex={1} sx={{ overflowX: 'hidden' }}>
          {children}
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  );
};

export default Layout;
