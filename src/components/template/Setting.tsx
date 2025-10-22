'use client';

import { useAuthStore } from '@/store/auth.store';
import { useEventBus } from '@/store/event-bus.store';
import { AppEventType } from '@/store/lib/app-event';
import mutationKeys from '@/store/lib/mutation-key';
import queryKeys from '@/store/lib/query-key';
import { getUserSettings } from '@api/user/get-user-settings';
import { updateUserSettings } from '@api/user/setting/update-user-settings';
import CommonText from '@components/atom/CommonText';
import OutlineStack from '@components/atom/OutlineStack';
import SettingItem from '@components/molecular/SettingItem';
import { useTheme } from '@context/ThemeContext';
import { Check as CheckIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { Box, Chip, ListItemIcon, ListItemText, Menu, MenuItem, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface SettingProps {}
const Setting: React.FC<SettingProps> = () => {
  const { mode, changeTheme } = useTheme();
  const publish = useEventBus((s) => s.publish);
  const user = useAuthStore((state) => state.user);
  const addNotice = useAuthStore((state) => state.addNotice)!;
  const fetchUser = useAuthStore((state) => state.actions.fetchUser);
  const [themeMenuAnchor, setThemeMenuAnchor] = useState<null | HTMLElement>(null);
  const { data } = useQuery({
    queryKey: queryKeys.user.settings(),
    queryFn: getUserSettings,
    enabled: !!user,
  });
  const { mutate: updateUserSettingsMutation } = useMutation({
    mutationKey: mutationKeys.user.settings(),
    mutationFn: ({ mailing }: { mailing: boolean }) => updateUserSettings(mailing),
    onSuccess: async () => {
      await fetchUser();
      publish({ type: AppEventType.USER_SETTINGS_UPDATED });
    },
  });

  const handleEmailNotificationSubmit = (checked: boolean) => {
    updateUserSettingsMutation({ mailing: checked });
    addNotice(checked ? '이메일 알림 설정이 활성화되었습니다.' : '이메일 알림 설정이 비활성화되었습니다.', 'success');
  };

  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenuAnchor(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenuAnchor(null);
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    changeTheme(newMode);
    handleThemeMenuClose();
  };

  const getThemeLabel = (mode: 'light' | 'dark' | 'system') => {
    switch (mode) {
      case 'light':
        return '라이트 모드';
      case 'dark':
        return '다크 모드';
      case 'system':
        return '시스템 설정';
      default:
        return '시스템 설정';
    }
  };

  const getThemeIcon = (mode: 'light' | 'dark' | 'system') => {
    switch (mode) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      case 'system':
        return <SettingsIcon />;
      default:
        return <SettingsIcon />;
    }
  };

  // TODO: 설정 데이터 가져오기
  return (
    <OutlineStack gap={5} p={3}>
      {/* <SettingItem title="FAB 메뉴 🧪" description="Shift + 마우스 오른쪽 클릭 플로팅 작업 메뉴 활성화" /> */}
      <SettingItem
        title="이메일 알림"
        description="새로운 응답에 대한 이메일 알림을 받으세요"
        checked={data?.payload?.mailing ?? false}
        onSubmit={handleEmailNotificationSubmit}
      />

      {/* 테마 설정 */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Stack>
          <CommonText variant="h6" gutterBottom>
            테마 설정
          </CommonText>
          <CommonText variant="body2">앱의 테마를 선택하세요. 시스템 설정을 선택하면 OS 설정을 따릅니다.</CommonText>
        </Stack>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip icon={getThemeIcon(mode)} label={getThemeLabel(mode)} variant="outlined" onClick={handleThemeMenuOpen} sx={{ cursor: 'pointer' }} />
          {/* <IconButton onClick={handleThemeMenuOpen} size="small">
              <SettingsIcon />
            </IconButton> */}
        </Box>
      </Box>

      <Menu
        anchorEl={themeMenuAnchor}
        open={Boolean(themeMenuAnchor)}
        onClose={handleThemeMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleThemeChange('light')}>
          <ListItemIcon>
            <LightModeIcon />
          </ListItemIcon>
          <ListItemText primary="라이트 모드" />
          {mode === 'light' && <CheckIcon color="primary" />}
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('dark')}>
          <ListItemIcon>
            <DarkModeIcon />
          </ListItemIcon>
          <ListItemText primary="다크 모드" />
          {mode === 'dark' && <CheckIcon color="primary" />}
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('system')}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="시스템 설정" />
          {mode === 'system' && <CheckIcon color="primary" />}
        </MenuItem>
      </Menu>
    </OutlineStack>
  );
};

export default Setting;
