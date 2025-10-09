import queryKeys from '@/store/lib/query-key';
import { getUserOrganizations } from '@api/user/get-user-organizations';
import Versioning from '@components/atom/Versioning';
import Footer from '@components/organism/Footer';
import Header from '@components/organism/Header';
import Sidebar from '@components/organism/Sidebar';
import { Stack } from '@mui/material';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.organization.list(),
    queryFn: getUserOrganizations,
  });

  return (
    <Stack id="wrap" flex={1} sx={{ position: 'relative' }}>
      <Versioning sx={{ top: 67, left: 10 }} />
      <Header />
      <Stack direction="row" flex={1}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Sidebar />
        </HydrationBoundary>
        <Stack flex={1} sx={{ overflowX: 'hidden' }}>
          {children}
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  );
};

export default Layout;
