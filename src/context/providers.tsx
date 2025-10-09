import { getUserInformation } from '@api/server/get-user-information';
import { CssBaseline } from '@mui/material';
import AuthenticationProvider from './AuthenticationContext';
import { AxiosProvider } from './AxiosContext';
import GlobalDialogProvider from './GlobalDialogContext';
import { GlobalSnackbar } from './GlobalSnackbar';
import { GlobalSnackbarSettingProvider } from './GlobalSnackbarSettingProvider';
import { NetworkProvider } from './NetworkContext';
import { QueryInvalidationBridge } from './QueryInvalidationBridge';
import ReactQueryProvider from './ReactQueryProvider';
import { ThemeProvider } from './ThemeContext';

interface ProvidersProps {
  children: React.ReactNode;
}
const Providers: React.FC<ProvidersProps> = async ({ children }) => {
  const user = await getUserInformation();

  return (
    <ThemeProvider>
      <AuthenticationProvider initialize={true} user={user} />
      <AxiosProvider>
        <CssBaseline />
        <GlobalSnackbarSettingProvider>
          <GlobalSnackbar>
            <ReactQueryProvider>
              <QueryInvalidationBridge />
              <NetworkProvider>
                <GlobalDialogProvider>
                  {/* <LoadingProvider> */}
                  {children}
                  {/* </LoadingProvider> */}
                </GlobalDialogProvider>
              </NetworkProvider>
            </ReactQueryProvider>
          </GlobalSnackbar>
        </GlobalSnackbarSettingProvider>
      </AxiosProvider>
    </ThemeProvider>
  );
};

export default Providers;
