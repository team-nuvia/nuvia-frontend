import { LoadingProvider } from '@/context/LodingContext';
import Loading from '@components/atom/Loading';
import Header from '@components/organism/Header';
import Sidebar from '@components/organism/Sidebar';
import { CssBaseline, Stack, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ReactQueryProvider from '@util/react-query-provider';
import { lightTheme } from '@util/theme';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SnapPoll - Quick Survey Platform',
  description: 'Create and manage surveys with ease',
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
          <AppRouterCacheProvider>
            <LoadingProvider>
              <CssBaseline />
              <ThemeProvider theme={lightTheme}>
                {' '}
                <Suspense fallback={<Loading />}>
                  <Stack>
                    <Header />
                    {children}
                  </Stack>
                </Suspense>
              </ThemeProvider>
            </LoadingProvider>
          </AppRouterCacheProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
