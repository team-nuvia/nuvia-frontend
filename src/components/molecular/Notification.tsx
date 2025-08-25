import { getNotifications } from '@api/get-notifications';
import { toggleReadNotification } from '@api/toggle-read-notification';
import ActionButton from '@components/atom/ActionButton';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Badge, Box, Divider, IconButton, Menu, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DateFormat } from '@util/dateFormat';
import { useRouter } from 'next/navigation';
import React, { useContext, useMemo, useState } from 'react';

const Notification = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const { addNotice } = useContext(GlobalSnackbarContext);
  const [anchorElNotification, setAnchorElNotification] = useState<null | HTMLElement>(null);
  const { data: notifications, refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications({ page, limit, search }),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
  const { mutate: toggleReadNotificationMutate } = useMutation({
    mutationFn: ({ notificationId, isRead }: { notificationId: number; isRead: boolean }) => toggleReadNotification(notificationId, isRead),
    onSuccess: (data) => {
      addNotice(data.message ?? '알림 읽음 처리 완료', 'success');
      refetchNotifications();
    },
  });
  const notificationList = notifications?.payload?.data ?? [];
  const notificationCount = useMemo(() => {
    return notificationList.filter((notification) => !notification.isRead).length;
  }, [notificationList]);
  const handleOpenNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null);
  };

  const handleReadNotification = (notificationId: number, isRead: boolean) => {
    toggleReadNotificationMutate({ notificationId, isRead: !isRead });
  };

  return (
    <Stack>
      <Tooltip title="알림" placement="right" arrow>
        <Badge badgeContent={notificationCount} color="error">
          <IconButton onClick={handleOpenNotificationMenu} sx={{ p: 0.5 }}>
            {notificationCount > 0 ? <NotificationsActiveOutlinedIcon /> : <NotificationsOutlinedIcon />}
          </IconButton>
        </Badge>
      </Tooltip>
      {/* 알림 메뉴 */}
      <Menu
        anchorEl={anchorElNotification}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElNotification)}
        onClose={handleCloseNotificationMenu}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxHeight: 400,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid',
              borderColor: 'divider',
            },
          },
        }}
      >
        <Stack sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              알림
            </Typography>
            <IconButton size="small" onClick={() => refetchNotifications()}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Stack>

          {notificationList.length === 0 ? (
            <Stack alignItems="center" py={4} spacing={2}>
              <NotificationsOffOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                새로운 알림이 없습니다
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={1} sx={{ maxHeight: 280, overflowY: 'auto' }}>
              {notificationList.map((notification) => (
                <Paper
                  key={notification.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: notification.isRead ? 'transparent' : 'primary.main',
                    bgcolor: notification.isRead ? 'transparent' : 'primary.50',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => handleReadNotification(notification.id, notification.isRead)}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Typography
                        variant="subtitle2"
                        fontWeight={notification.isRead ? 'normal' : 'bold'}
                        sx={{
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {notification.title}
                      </Typography>
                      {!notification.isRead && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            flexShrink: 0,
                            ml: 1,
                          }}
                        />
                      )}
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {notification.content}
                    </Typography>

                    <Typography variant="caption" color="text.disabled" title={DateFormat.toKSTOnly(notification.createdAt)}>
                      {DateFormat.getTimeAgo(notification.createdAt)}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
          <Divider />
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <ActionButton
              variant="text"
              size="small"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={() => {
                // 알림 전체 보기 페이지로 이동
                router.push('/notifications');
                setAnchorElNotification(null);
              }}
            >
              전체 보기
            </ActionButton>
          </Stack>
        </Stack>
      </Menu>
    </Stack>
  );
};

export default Notification;
