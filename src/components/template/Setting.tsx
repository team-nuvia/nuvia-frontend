'use client';

import CommonText from '@components/atom/CommonText';
import SettingItem from '@components/molecular/SettingItem';
import { Stack } from '@mui/material';

interface SettingProps {}
const Setting: React.FC<SettingProps> = () => {
  // TODO: 설정 데이터 가져오기
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
