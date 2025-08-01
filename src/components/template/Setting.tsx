'use client';

import { getUserSettings } from '@api/get-user-settings';
import CommonText from '@components/atom/CommonText';
import SettingItem from '@components/molecular/SettingItem';
import { AuthenticationContext } from '@context/AuthenticationContext';
import LoadingContext from '@context/LodingContext';
import { Stack } from '@mui/material';
import { isNil } from '@util/isNil';
import { useRouter } from 'next/navigation';
import { useContext, useLayoutEffect } from 'react';

interface SettingProps {}
const Setting: React.FC<SettingProps> = () => {
  const { user } = useContext(AuthenticationContext);
  const { setLoading } = useContext(LoadingContext);
  const router = useRouter();

  useLayoutEffect(() => {
    setLoading(true, '설정 정보를 불러오는 중...');
    getUserSettings()
      .then(() => {
        if (isNil(user)) {
          router.push('/auth/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, router]);

  return (
    <Stack flex={1} gap={3} p={5}>
      <CommonText variant="h4">설정</CommonText>
      <Stack
        gap={5}
        sx={{
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'divider',
          borderRadius: 3,
          p: 3,
        }}
      >
        <SettingItem title="FAB 메뉴 🧪" description="Shift + 마우스 오른쪽 클릭 플로팅 작업 메뉴 활성화" />
        <SettingItem title="알림" description="새로운 응답에 대한 이메일 알림을 받으세요" />
      </Stack>
    </Stack>
  );
};

export default Setting;
