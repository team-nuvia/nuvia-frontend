import AuthenticationProvider from '@/context/AuthenticationContext';
import { LoadingProvider } from '@/context/LoadingContext';
import { QueryInvalidationBridge } from '@/context/QueryInvalidationBridge';
import '@/styles/global.css';
import { getUserInformation } from '@api/server/get-user-information';
import { BRAND_NAME } from '@common/variables';
import { AxiosProvider } from '@context/AxiosContext';
import GlobalDialogProvider from '@context/GlobalDialogContext';
import { GlobalSnackbar } from '@context/GlobalSnackbar';
import { GlobalSnackbarSettingProvider } from '@context/GlobalSnackbarSettingProvider';
import { NetworkProvider } from '@context/NetworkContext';
import ReactQueryProvider from '@context/ReactQueryProvider';
import { ThemeProvider } from '@context/ThemeContext';
import { CssBaseline, InitColorSchemeScript } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata, Viewport } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import GoogleAnalytics from '@components/GoogleAnalytics';
import Versioning from '@components/atom/Versioning';

const notoSansKR = Noto_Sans_KR({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} - 빠르고 간편한 설문 플랫폼`,
  description: '설문을 쉽고 빠르게 생성하고 관리하세요. 직관적인 인터페이스로 누구나 쉽게 설문을 만들고 응답을 분석할 수 있습니다.',
  keywords: ['설문', '설문조사', '폼', '데이터 수집', '응답 분석', '온라인 설문'],
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
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
  manifest: '/favicon/site.webmanifest',
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
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className={notoSansKR.className}>
        <InitColorSchemeScript defaultMode="system" attribute="class" modeStorageKey="theme-mode" />
        {measurementId && <GoogleAnalytics measurementId={measurementId} />}
        <AppRouterCacheProvider>
          <ThemeProvider>
            <AxiosProvider>
              <CssBaseline />
              <GlobalSnackbarSettingProvider>
                <GlobalSnackbar>
                  <ReactQueryProvider>
                    <QueryInvalidationBridge />
                    <NetworkProvider>
                      <GlobalDialogProvider>
                        <LoadingProvider>
                          <AuthenticationProvider initialize={true} user={user}>
                            {children}
                          </AuthenticationProvider>
                        </LoadingProvider>
                      </GlobalDialogProvider>
                    </NetworkProvider>
                  </ReactQueryProvider>
                </GlobalSnackbar>
              </GlobalSnackbarSettingProvider>
            </AxiosProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
