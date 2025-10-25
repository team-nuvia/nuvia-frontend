import { NotificationPayload } from '@/models/NotificationPayload';
import CheckIcon from '@mui/icons-material/Check';
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { DateFormat } from '@util/dateFormat';
import { memo } from 'react';

interface NotificationRowProps {
  notification: NotificationPayload;
  handleNotificationClick: (notification: NotificationPayload) => void;
  handleSelectNotification: (notificationId: number) => void;
  selectedNotifications: number[];
}
const NotificationRow: React.FC<NotificationRowProps> = ({
  notification,
  handleNotificationClick,
  handleSelectNotification,
  selectedNotifications,
}) => {
  return (
    <ListItem
      key={notification.id}
      disablePadding
      dense
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: notification.isRead ? 'transparent' : 'primary.50',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <ListItemButton
        onClick={() => handleNotificationClick(notification)}
        sx={{
          backgroundColor: notification.isRead ? 'grey.100' : 'transparent',
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: selectedNotifications.includes(notification.id) ? 'primary.main' : 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectNotification(notification.id);
            }}
          >
            {selectedNotifications.includes(notification.id) && <CheckIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
          </Box>
        </ListItemIcon>

        <ListItemText
          primary={
            <Stack direction="row" gap={1} alignItems="center">
              <Typography
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  fontWeight: notification.isRead ? 'normal' : 'bold',
                }}
              >
                {notification.title}
              </Typography>
              <Typography
                flex={1}
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: notification.isRead ? 'normal' : 'bold',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {notification.content}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                {DateFormat.getTimeAgo(notification.createdAt)}
              </Typography>
            </Stack>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default memo(NotificationRow);
