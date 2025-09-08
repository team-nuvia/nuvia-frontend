import { Stack } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = async ({ children }) => {
  return (
    <Stack direction="row" flex={1}>
      <Stack flex={1} sx={{ overflowX: 'hidden' }}>
        {children}
      </Stack>
    </Stack>
  );
};

export default Layout;
