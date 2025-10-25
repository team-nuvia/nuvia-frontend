import { NotificationPayload } from '@/models/NotificationPayload';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Badge, Box, Button, Divider, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { NotificationType } from '@share/enums/notification-type';
import { memo, useState } from 'react';

interface NotificationSidebarProps {
  notificationCount: number;
  uniqueNotifications: NotificationPayload[];
  selectedCategory: NotificationType | 'all';
  showUnreadOnly: boolean;
  setSelectedCategory: (category: NotificationType | 'all') => void;
  setShowUnreadOnly: (showUnreadOnly: boolean) => void;
  getCategoryLabel: (type: NotificationType | 'all') => string;
}
const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
  notificationCount,
  uniqueNotifications,
  selectedCategory,
  showUnreadOnly,
  setSelectedCategory,
  setShowUnreadOnly,
  getCategoryLabel,
}) => {
  const [search, setSearch] = useState('');

  return (
    <Box
      bgcolor="background.paper"
      sx={{
        borderRightWidth: 1,
        borderRightStyle: 'solid',
        borderRightColor: 'divider',
        borderRadius: 0,
      }}
    >
      <Box position="sticky" top={64} left={0} width={280}>
        {/* 헤더 */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <NotificationsActiveOutlinedIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              알림
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            총 {uniqueNotifications.length}개, {notificationCount}개 읽지 않음
          </Typography>
        </Box>

        {/* 검색 */}
        <Box sx={{ p: 2 }}>
          <TextField
            placeholder="알림 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* 필터 */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Stack spacing={1}>
            <Button
              variant={showUnreadOnly ? 'contained' : 'text'}
              startIcon={<NotificationsActiveOutlinedIcon />}
              endIcon={
                <Badge badgeContent={notificationCount} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ ml: 1 }} />
              }
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              sx={{ justifyContent: 'flex-start' }}
            >
              읽지 않은 알림
            </Button>

            <Divider />

            <Typography variant="subtitle2" color="text.secondary" sx={{ px: 1 }}>
              카테고리
            </Typography>

            <Button
              variant={selectedCategory === 'all' ? 'contained' : 'text'}
              onClick={() => setSelectedCategory('all')}
              sx={{ justifyContent: 'flex-start' }}
            >
              전체
            </Button>

            {Object.values(NotificationType).map((type) => (
              <Button
                key={type}
                variant={selectedCategory === type ? 'contained' : 'text'}
                onClick={() => setSelectedCategory(type)}
                sx={{ justifyContent: 'flex-start' }}
              >
                {getCategoryLabel(type)}
              </Button>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(NotificationSidebar);
