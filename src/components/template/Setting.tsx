'use client';

import { updateUserSettings } from '@api/update-user-settings';
import CommonText from '@components/atom/CommonText';
import SettingItem from '@components/molecular/SettingItem';
import { Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

interface SettingProps {}
const Setting: React.FC<SettingProps> = () => {
  const { mutate: updateUserSettingsMutation } = useMutation({
    mutationFn: ({ mailNotification }: { mailNotification: boolean }) => updateUserSettings(mailNotification),
  });

  const handleEmailNotificationSubmit = (checked: boolean) => {
    console.log('checked', checked);
    updateUserSettingsMutation({ mailNotification: checked });
  };

  const handleToggleDarkmodeSubmit = (checked: boolean) => {
    console.log('checked', checked);
  };

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
        {/* <SettingItem title="FAB 메뉴 🧪" description="Shift + 마우스 오른쪽 클릭 플로팅 작업 메뉴 활성화" /> */}
        <SettingItem title="이메일 알림" description="새로운 응답에 대한 이메일 알림을 받으세요" onSubmit={handleEmailNotificationSubmit} />
        <SettingItem title="다크모드" description="다크모드 활성화" onSubmit={handleToggleDarkmodeSubmit} />
      </Stack>
    </Stack>
  );
};

export default Setting;
