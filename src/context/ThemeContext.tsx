'use client';

import { useAuthStore } from '@/store/auth.store';
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { darkTheme, lightTheme } from '@util/theme';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';

export type { Dayjs } from 'dayjs';

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Seoul');
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  changeTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  mode: 'system',
  changeTheme: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => {
  return useContext(ThemeContext);
};

// 시스템 테마 감지 함수
const getSystemTheme = (): 'light' | 'dark' => {
  // TODO: 시스템 무시하고 light로 적용
  // if (typeof window !== 'undefined' && window.matchMedia) {
  //   return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  // }
  return 'light';
};

// 로컬스토리지에서 테마 설정 가져오기
const getStoredTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored as ThemeMode;
    }
  }
  return 'system';
};

// 실제 적용될 테마 계산
const getEffectiveTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const user = useAuthStore((state) => state.user);

  // 초기 테마 설정 (깜빡임 방지)
  useLayoutEffect(() => {
    const storedMode = getStoredTheme();
    const effectiveTheme = getEffectiveTheme(storedMode);

    setMode(storedMode);
    setTheme(effectiveTheme === 'dark' ? darkTheme : lightTheme);
    if (user) {
      localStorage.setItem(`theme-mode`, storedMode);
    }
  }, [user]);

  // 시스템 테마 변경 감지
  useEffect(() => {
    if (mode === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        const effectiveTheme = e.matches ? 'dark' : 'light';
        setTheme(effectiveTheme === 'dark' ? darkTheme : lightTheme);
        if (user) {
          localStorage.setItem(`theme-mode`, effectiveTheme);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [mode]);

  const changeTheme = useCallback(
    (newMode: ThemeMode) => {
      setMode(newMode);

      // 로컬스토리지에 저장
      if (typeof window !== 'undefined') {
        if (user) {
          localStorage.setItem(`theme-mode`, newMode);
        }
      }

      // 즉시 테마 적용
      const effectiveTheme = getEffectiveTheme(newMode);
      setTheme(effectiveTheme === 'dark' ? darkTheme : lightTheme);
    },
    [user],
  );

  const toggleTheme = useCallback(() => {
    const currentEffectiveTheme = getEffectiveTheme(mode);
    const newMode = currentEffectiveTheme === 'dark' ? 'light' : 'dark';
    changeTheme(newMode);
  }, [mode, changeTheme]);

  return (
    <ThemeContext.Provider value={{ theme, mode, changeTheme, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          {children}
        </LocalizationProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
