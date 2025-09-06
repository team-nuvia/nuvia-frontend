import AuthenticationProvider from '@/context/AuthenticationContext';
import { LoadingProvider } from '@/context/LoadingContext';
import '@/styles/global.css';
import { getUserInformation } from '@api/server/get-user-information';
import { BRAND_NAME } from '@common/variables';
import Footer from '@components/organism/Footer';
import Header from '@components/organism/Header';
import WrapChildren from '@components/organism/WrapChildren';
import GlobalDialogProvider from '@context/GlobalDialogContext';
import { GlobalSnackbar } from '@context/GlobalSnackbar';
import { GlobalSnackbarSettingProvider } from '@context/GlobalSnackbarSettingProvider';
import ReactQueryProvider from '@context/ReactQueryProvider';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { darkTheme } from '@util/theme';
import type { Metadata, Viewport } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: `${BRAND_NAME} - 빠르고 간편한 설문 플랫폼`,
  description: '설문을 쉽고 빠르게 생성하고 관리하세요. 직관적인 인터페이스로 누구나 쉽게 설문을 만들고 응답을 분석할 수 있습니다.',
  keywords: ['설문', '설문조사', '폼', '데이터 수집', '응답 분석', '온라인 설문'],
  openGraph: {
    title: `${BRAND_NAME} - 빠르고 간편한 설문 플랫폼`,
    description: '설문을 쉽고 빠르게 생성하고 관리하세요. 직관적인 인터페이스로 누구나 쉽게 설문을 만들고 응답을 분석할 수 있습니다.',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} - 빠르고 간편한 설문 플랫폼`,
    description: '설문을 쉽고 빠르게 생성하고 관리하세요.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserInformation();
  return (
    <html lang="ko">
      <body /* className={`${geistSans.variable} ${geistMono.variable}`} */>
        <ReactQueryProvider>
          <AuthenticationProvider initialize={true} user={user}>
            <AppRouterCacheProvider>
              <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <GlobalSnackbarSettingProvider>
                  <GlobalSnackbar>
                    <GlobalDialogProvider>
                      <LoadingProvider>
                        <Header />
                        <WrapChildren>{children}</WrapChildren>
                        <Footer />
                      </LoadingProvider>
                    </GlobalDialogProvider>
                  </GlobalSnackbar>
                </GlobalSnackbarSettingProvider>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </AuthenticationProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
