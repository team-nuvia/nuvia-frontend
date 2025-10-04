'use client';

import { GetMeResponse } from '@/models/GetMeResponse';
import { getVerify } from '@api/auth/get-verify';
import { getVerifySession } from '@api/auth/get-verify-session';
import { logout } from '@api/auth/logout';
import { getUsersMe } from '@api/user/get-users-me';
import { isGuestPath, isMemberPath } from '@util/guard';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { VariantType } from 'notistack';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

interface AuthStore {
  user: GetMeResponse | null;
  isUserLoading: boolean;
  mainUrl: string;
  router: AppRouterInstance | null;
  addNotice: ((message: string, variant?: VariantType) => void) | null;
}

const initialState: AuthStore = {
  user: null,
  isUserLoading: false,
  mainUrl: '/',
  router: null,
  addNotice: null,
};

export const useAuthStore = create(
  combine(initialState, (set, get) => {
    function getUser() {
      return get().user;
    }
    function getAddNotice() {
      return get().addNotice!;
    }
    function setRouter(router: AppRouterInstance) {
      set({
        router: {
          push: (path: string) => {
            const user = get().user;
            const addNotice = get().addNotice!;
            if (user) {
              if (isGuestPath(path)) {
                addNotice('접근 불가한 페이지입니다.', 'warning');
                return;
              }
            } else {
              if (isMemberPath(path)) {
                addNotice('로그인이 필요한 페이지입니다.', 'warning');
                return;
              }
            }

            router.push(path);
          },
          back: router.back,
          replace: router.replace,
          refresh: router.refresh,
          prefetch: router.prefetch,
          forward: router.forward,
        },
      });
    }
    function setAddNotice(addNotice: (message: string, variant?: VariantType) => void) {
      set({ addNotice });
    }
    function setUser(user: GetMeResponse | null) {
      set({ user });
    }
    function setIsUserLoading(isUserLoading: boolean) {
      set({ isUserLoading });
    }
    function setMainUrl(mainUrl: string) {
      set({ mainUrl });
    }
    async function verify() {
      await getVerify();
    }
    async function verifySession() {
      const sessionData = await getVerifySession();
      if (sessionData.ok && sessionData.payload?.verified) {
        await getUsersMe();
      }
    }
    async function clearUser() {
      const prev = window.location.pathname;
      try {
        await logout();
        // verifyToken();
      } finally {
        set({ user: null });
        set({ mainUrl: '/' });
        set({ isUserLoading: false });
        if (!prev.startsWith('/auth/login')) {
          get().router?.push(`/auth/login?redirect=${encodeURIComponent(prev)}&action=view`);
        }
        get().addNotice!('로그아웃 되었습니다.', 'success');
      }
    }
    async function fetchUser() {
      set({ isUserLoading: true });
      await updateUser();
    }
    async function updateUser() {
      const response = await getUsersMe();
      set({ user: response.payload });
      set({ isUserLoading: false });
      set({ mainUrl: '/dashboard' });
    }
    return {
      actions: {
        getAddNotice,
        setAddNotice,
        setRouter,
        getUser,
        setUser,
        setIsUserLoading,
        setMainUrl,
        verify,
        verifySession,
        clearUser,
        fetchUser,
        updateUser,
      },
    };
  }),
);
