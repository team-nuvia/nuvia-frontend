import { NotificationPayload } from '@/models/NotificationPayload';
import { useEventBus } from '@/store/event-bus.store';
import { AppEventType } from '@/store/lib/app-event';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, Divider, IconButton, Paper, Stack, Typography } from '@mui/material';
import { memo } from 'react';

interface NotificationActionBarProps {
  selectedNotifications: number[];
  filteredNotifications: NotificationPayload[];
  handleSelectAll: () => void;
  handleMarkAsRead: () => void;
  handleUmarkAsRead: () => void;
  isSomeNotRead: boolean;
}

const NotificationActionBar: React.FC<NotificationActionBarProps> = ({
  selectedNotifications,
  filteredNotifications,
  handleSelectAll,
  handleMarkAsRead,
  handleUmarkAsRead,
  isSomeNotRead,
}) => {
  const publish = useEventBus((s) => s.publish);

  return (
    <Paper elevation={0} sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Button size="small" onClick={handleSelectAll} sx={{ minWidth: 'auto', px: 1 }}>
            {selectedNotifications.length === filteredNotifications.length ? '전체 해제' : '전체 선택'}
          </Button>
          {selectedNotifications.length > 0 && (
            <>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body2" color="text.secondary">
                {selectedNotifications.length}개 선택됨
              </Typography>
              <Button size="small" startIcon={<MarkEmailReadIcon />} onClick={isSomeNotRead ? handleMarkAsRead : handleUmarkAsRead}>
                {isSomeNotRead ? '읽음' : '안 읽음'}
              </Button>
            </>
          )}
        </Stack>
        <Stack>
          <IconButton
            size="small"
            onClick={() => {
              publish({ type: AppEventType.NOTIFICATION_REFRESH });
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default memo(NotificationActionBar);
