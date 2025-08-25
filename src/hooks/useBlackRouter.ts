import { AuthenticationContext } from '@context/AuthenticationContext';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import { routerBlackList } from '@util/blackRouter';
import { useRouter } from 'next/navigation';
import { useCallback, useContext } from 'react';

/**
 * 블랙 리스트 페이지에 접근할 경우 로그인 페이지로 리다이렉트
 * 로그인 상태가 아닌 경우 로그인 페이지로 리다이렉트
 * 로그인 상태인 경우 페이지 이동
 */
export const useBlackRouter = () => {
  const router = useRouter();
  const { isVerified } = useContext(AuthenticationContext);
  const { addNotice } = useContext(GlobalSnackbarContext);

  const push = useCallback(
    (path: string) => {
      if (!routerBlackList.some((black) => path.startsWith(black)) || isVerified) {
        router.push(path);
      } else {
        addNotice('로그인이 필요한 페이지입니다.', 'warning');
      }
    },
    [router, isVerified],
  );

  return { push, back: router.back, replace: router.replace, refresh: router.refresh, prefetch: router.prefetch };
};
