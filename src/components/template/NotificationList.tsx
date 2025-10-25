'use client';

import { useAuthStore } from '@/store/auth.store';
import { useEventBus } from '@/store/event-bus.store';
import { AppEventType } from '@/store/lib/app-event';
import queryKeys from '@/store/lib/query-key';
import { getNotifications } from '@api/notification/get-notifications';
import { toggleReadAllNotification } from '@api/notification/toggle-read-all-notification';
import { toggleReadNotification } from '@api/notification/toggle-read-notification';
import { updateInvitationResult } from '@api/subscription/update-invitation-result';
import ActionButton from '@components/atom/ActionButton';
import NotificationActionBar from '@components/organism/notifications/NotificationActionBar';
import NotificationRow from '@components/organism/notifications/NotificationRow';
import NotificationSidebar from '@components/organism/notifications/NotificationSidebar';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import { Box, Chip, ChipProps, Dialog, DialogActions, DialogContent, DialogTitle, List, Pagination, Stack, Typography } from '@mui/material';
import { NotificationActionStatus } from '@share/enums/notification-action-status';
import { NotificationType } from '@share/enums/notification-type';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DateFormat } from '@util/dateFormat';
import { isNil } from '@util/isNil';
import { LocalizationManager } from '@util/LocalizationManager';
import React, { useContext, useEffect, useMemo, useState } from 'react';

interface NotificationListProps {}

const NotificationList: React.FC<NotificationListProps> = () => {
  const user = useAuthStore((state) => state.user);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NotificationType | 'all'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { addNotice } = useContext(GlobalSnackbarContext);
  const publish = useEventBus((s) => s.publish);

  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.notification.list(),
    queryFn: () => getNotifications({ page, limit, search }),
    enabled: !!user,
  });

  const { mutate: acceptInvitationMutate } = useMutation({
    mutationFn: ({ subscriptionId, notificationId }: { subscriptionId: number; notificationId: number }) =>
      updateInvitationResult(subscriptionId, notificationId, OrganizationRoleStatusType.Joined),
    onSuccess: (data) => {
      addNotice(data.message ?? '초대 수락 완료', 'success');
      publish({ type: AppEventType.NOTIFICATION_RELOAD });
    },
  });

  const { mutate: rejectInvitationMutate } = useMutation({
    mutationFn: ({ subscriptionId, notificationId }: { subscriptionId: number; notificationId: number }) =>
      updateInvitationResult(subscriptionId, notificationId, OrganizationRoleStatusType.Rejected),
    onSuccess: (data) => {
      addNotice(data.message ?? '초대 거절 완료', 'success');
      publish({ type: AppEventType.NOTIFICATION_RELOAD });
    },
  });

  const { mutate: toggleReadNotificationMutate } = useMutation({
    mutationFn: ({ notificationId, isRead }: { notificationId: number; isRead: boolean }) => toggleReadNotification(notificationId, isRead),
    onSuccess: (data) => {
      addNotice(data.message ?? '알림 읽음 처리 완료', 'success');
      publish({ type: AppEventType.NOTIFICATION_RELOAD });
    },
  });

  const { mutate: toggleReadAllNotificationMutate } = useMutation({
    mutationFn: ({ notificationIds, isRead }: { notificationIds: number[]; isRead: boolean }) => toggleReadAllNotification(notificationIds, isRead),
    onSuccess: (data) => {
      addNotice(data.message ?? '알림 읽음 처리 완료', 'success');
      publish({ type: AppEventType.NOTIFICATION_RELOAD });
    },
  });

  useEffect(() => {
    if (isError) {
      addNotice('알림 목록 조회 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    }
  }, [isError]);

  const notificationList = notifications?.payload?.data ?? [];

  // 중복 제거 (최신 데이터로 교체)
  const uniqueNotifications = useMemo(() => {
    const seen = new Map();
    return notificationList.filter((notification) => {
      const key = `${notification.type}-${notification.title}-${notification.content}`;
      if (seen.has(key)) {
        // 중복이면 더 최신 데이터로 교체
        const existing = seen.get(key);
        if (new Date(notification.createdAt) > new Date(existing.createdAt)) {
          seen.set(key, notification);
          return true;
        }
        return false;
      }
      seen.set(key, notification);
      return true;
    });
  }, [notificationList]);

  // 필터링된 알림
  const filteredNotifications = useMemo(() => {
    let filtered = uniqueNotifications;

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((notification) => notification.type === selectedCategory);
    }

    // 읽지 않은 알림만 보기
    if (showUnreadOnly) {
      filtered = filtered.filter((notification) => !notification.isRead);
    }

    return filtered;
  }, [uniqueNotifications, selectedCategory, showUnreadOnly]);

  const notificationCount = useMemo(() => {
    return uniqueNotifications.filter((notification) => !notification.isRead).length;
  }, [uniqueNotifications]);

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);
    setModalOpen(true);
    // 읽지 않은 알림이면 읽음 처리
    // if (!notification.isRead) {
    //   toggleReadNotificationMutate({ notificationId: notification.id, isRead: false });
    // }
  };

  const handleAcceptInvitation = (subscriptionId: number, notificationId: number) => {
    acceptInvitationMutate({ subscriptionId, notificationId });
    setModalOpen(false);
  };

  const handleRejectInvitation = (subscriptionId: number, notificationId: number) => {
    rejectInvitationMutate({ subscriptionId, notificationId });
    setModalOpen(false);
  };

  const handleSelectNotification = (notificationId: number) => {
    setSelectedNotifications((prev) => (prev.includes(notificationId) ? prev.filter((id) => id !== notificationId) : [...prev, notificationId]));
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const handleMarkAsRead = () => {
    selectedNotifications.forEach((notificationId) => {
      const notification = uniqueNotifications.find((n) => n.id === notificationId);
      if (notification && !notification.isRead) {
        toggleReadNotificationMutate({ notificationId, isRead: true });
      }
    });
    setSelectedNotifications([]);
  };

  const handleUmarkAsRead = () => {
    toggleReadAllNotificationMutate({ notificationIds: selectedNotifications, isRead: false });
    setSelectedNotifications([]);
  };

  const getCategoryLabel = (type: NotificationType | 'all') => {
    const labels = {
      [NotificationType.Notice]: '공지사항',
      [NotificationType.Invitation]: '초대',
      [NotificationType.Reported]: '신고',
      [NotificationType.Mention]: '멘션',
      [NotificationType.Information]: '정보',
      all: '전체',
    };
    return labels[type];
  };

  const getCategoryColor = (type: NotificationType): ChipProps['color'] => {
    const colors = {
      [NotificationType.Notice]: 'primary',
      [NotificationType.Invitation]: 'success',
      [NotificationType.Reported]: 'error',
      [NotificationType.Mention]: 'warning',
      [NotificationType.Information]: 'info',
    } as const;
    return colors[type] || 'default';
  };

  const getCategoryIcon = (type: NotificationType) => {
    // 각 카테고리별 아이콘을 반환 (실제로는 적절한 아이콘으로 교체)
    return <NotificationsActiveOutlinedIcon fontSize="small" />;
  };

  const isSomeNotRead = useMemo(() => {
    return selectedNotifications.some((id) => !uniqueNotifications.find((n) => n.id === id)?.isRead);
  }, [selectedNotifications, uniqueNotifications]);

  if (!user) {
    return null;
  }

  return (
    <Stack direction="row" flex={1}>
      {/* 사이드바 */}
      <NotificationSidebar
        notificationCount={notificationCount}
        uniqueNotifications={uniqueNotifications}
        selectedCategory={selectedCategory}
        showUnreadOnly={showUnreadOnly}
        setSelectedCategory={setSelectedCategory}
        setShowUnreadOnly={setShowUnreadOnly}
        getCategoryLabel={getCategoryLabel}
      />

      {/* 메인 콘텐츠 */}
      <Stack flex={1} sx={{ overflowX: 'hidden', bgcolor: 'background.paper' }}>
        {/* 액션 바 */}
        {filteredNotifications.length > 0 && (
          <NotificationActionBar
            selectedNotifications={selectedNotifications}
            filteredNotifications={filteredNotifications}
            handleSelectAll={handleSelectAll}
            handleMarkAsRead={handleMarkAsRead}
            handleUmarkAsRead={handleUmarkAsRead}
            isSomeNotRead={isSomeNotRead}
          />
        )}

        {/* 알림 리스트 */}
        <Box sx={{ flex: 1 }}>
          {isLoading ? (
            <Stack alignItems="center" py={8}>
              <Typography color="text.secondary">로딩 중...</Typography>
            </Stack>
          ) : filteredNotifications.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
              <NotificationsOffOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                {selectedCategory === 'all' && !showUnreadOnly
                  ? '알림이 없습니다'
                  : showUnreadOnly
                  ? '읽지 않은 알림이 없습니다'
                  : `${getCategoryLabel(selectedCategory)} 알림이 없습니다`}
              </Typography>
              <Typography variant="body2" color="text.disabled">
                새로운 알림이 오면 여기에 표시됩니다
              </Typography>
            </Stack>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredNotifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  handleNotificationClick={handleNotificationClick}
                  handleSelectNotification={handleSelectNotification}
                  selectedNotifications={selectedNotifications}
                />
              ))}
            </List>
          )}
        </Box>

        <Stack justifyContent="center" alignItems="center" sx={{ p: 2 }}>
          <Pagination count={Math.ceil((notifications?.payload?.total ?? 0) / limit)} page={page} onChange={(event, value) => setPage(value)} />
        </Stack>
      </Stack>

      {/* 알림 상세 모달 */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 2 },
          },
        }}
      >
        {selectedNotification && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Chip label={getCategoryLabel(selectedNotification.type)} color={getCategoryColor(selectedNotification.type)} variant="outlined" />
                <Typography variant="h6" fontWeight="bold">
                  {selectedNotification.title}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                {DateFormat.toUTCOnly(selectedNotification.createdAt)}
              </Typography>
            </DialogTitle>

            <DialogContent>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {selectedNotification.content}
              </Typography>

              {/* 초대 알림 액션 */}
              {selectedNotification.type === NotificationType.Invitation &&
                (isNil(selectedNotification.actionStatus) ? (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      초대에 응답하시겠습니까?
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <ActionButton
                        variant="contained"
                        startIcon={<CheckIcon />}
                        onClick={() => {
                          if (selectedNotification.referenceId && selectedNotification.id) {
                            handleAcceptInvitation(selectedNotification.referenceId, selectedNotification.id);
                          }
                        }}
                      >
                        수락
                      </ActionButton>
                      <ActionButton
                        variant="outlined"
                        startIcon={<CloseIcon />}
                        onClick={() => {
                          if (selectedNotification.referenceId && selectedNotification.id) {
                            handleRejectInvitation(selectedNotification.referenceId, selectedNotification.id);
                          }
                        }}
                      >
                        거절
                      </ActionButton>
                    </Stack>
                  </Box>
                ) : (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {selectedNotification.actionStatus === NotificationActionStatus.Joined ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )}
                      <Typography variant="body2" fontWeight="medium">
                        {LocalizationManager.translate(selectedNotification.actionStatus)}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
            </DialogContent>

            <DialogActions>
              <ActionButton onClick={() => setModalOpen(false)}>닫기</ActionButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Stack>
  );
};

export default NotificationList;
