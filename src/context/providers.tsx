import { getUserInformation } from '@api/server/get-user-information';
import LoadingScreen from '@components/molecular/LoadingScreen';
import { CssBaseline } from '@mui/material';
import { Suspense } from 'react';
import AuthenticationProvider from './AuthenticationContext';
import { AxiosProvider } from './AxiosContext';
import GlobalDialogProvider from './GlobalDialogContext';
import { GlobalSnackbar } from './GlobalSnackbar';
import { GlobalSnackbarSettingProvider } from './GlobalSnackbarSettingProvider';
import { NetworkProvider } from './NetworkContext';
import { QueryInvalidationBridge } from './QueryInvalidationBridge';
import ReactQueryProvider from './ReactQueryProvider';
import { ThemeProvider } from './ThemeContext';

const InitializeAuth = async () => {
  const user = await getUserInformation();
  return <AuthenticationProvider initialize={true} user={user} />;
};

interface ProvidersProps {
  children: React.ReactNode;
}
const Providers: React.FC<ProvidersProps> = async ({ children }) => {
  return (
    <ThemeProvider>
      <Suspense fallback={<LoadingScreen loadingText="서비스 로드 중..." />}>
        <InitializeAuth />
      </Suspense>
      <AxiosProvider>
        <CssBaseline />
        <GlobalSnackbarSettingProvider>
          <GlobalSnackbar>
            <ReactQueryProvider>
              <QueryInvalidationBridge />
              <NetworkProvider>
                <GlobalDialogProvider>{children}</GlobalDialogProvider>
              </NetworkProvider>
            </ReactQueryProvider>
          </GlobalSnackbar>
        </GlobalSnackbarSettingProvider>
      </AxiosProvider>
    </ThemeProvider>
  );
};

export default Providers;
