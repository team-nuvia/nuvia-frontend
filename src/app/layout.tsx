import AuthenticationProvider from '@/context/AuthenticationContext';
import { LoadingProvider } from '@/context/LodingContext';
import '@/styles/global.css';
import { BRAND_NAME } from '@common/variables';
import Footer from '@components/organism/Footer';
import Header from '@components/organism/Header';
import WrapChildren from '@components/organism/WrapChildren';
import GlobalDialogProvider from '@context/GlobalDialogContext';
import { GlobalSnackbar } from '@context/GlobalSnackbar';
import { GlobalSnackbarSettingProvider } from '@context/GlobalSnackbarSettingProvider';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ReactQueryProvider from '@util/react-query-provider';
import { lightTheme } from '@util/theme';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} - 빠르고 간편한 설문 플랫폼`,
  description: '설문을 쉽고 빠르게 생성하고 관리하세요',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          <AuthenticationProvider>
            <AppRouterCacheProvider>
              <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <GlobalDialogProvider>
                  <GlobalSnackbarSettingProvider>
                    <GlobalSnackbar>
                      <LoadingProvider>
                        {/* <Suspense fallback={<Loading />}> */}
                        <Header />
                        <WrapChildren>{children}</WrapChildren>
                        <Footer />
                        {/* </Suspense> */}
                      </LoadingProvider>
                    </GlobalSnackbar>
                  </GlobalSnackbarSettingProvider>
                </GlobalDialogProvider>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </AuthenticationProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
