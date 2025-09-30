import { GetMeResponse } from '@/models/GetMeResponse';
import ActionButton from '@components/atom/ActionButton';
import { AccountCircle, CalendarToday, Edit, Email, Person } from '@mui/icons-material';
import { Avatar, Card, CardContent, Divider, Stack, Typography, useTheme } from '@mui/material';
import { DateFormat } from '@util/dateFormat';

interface UserProfileCardProps {
  user: GetMeResponse | null;
}
const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const theme = useTheme();

  return (
    <Card elevation={2} sx={{ height: 'fit-content' }}>
      <CardContent sx={{ p: 4 }}>
        <Stack alignItems="center" spacing={3}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              fontSize: '3rem',
              bgcolor: theme.palette.primary.main,
            }}
          >
            {user?.name?.charAt(0) || <AccountCircle />}
          </Avatar>

          <Stack alignItems="center" spacing={1}>
            <Typography variant="h5" fontWeight="bold">
              {user?.name}
            </Typography>
          </Stack>

          <Divider sx={{ width: '100%' }} />

          <Stack spacing={2} sx={{ width: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Email color="action" />
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <CalendarToday color="action" />
              <Typography variant="body2" color="text.secondary">
                가입일: {DateFormat.toKST('YYYY-MM-dd HH:mm', user?.createdAt)}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Person color="action" />
              <Typography variant="body2" color="text.secondary">
                최근 접속: {DateFormat.toKST('YYYY-MM-dd HH:mm', user?.updatedAt)}
              </Typography>
            </Stack>
          </Stack>

          <ActionButton variant="contained" startIcon={<Edit />} fullWidth size="large">
            프로필 편집
          </ActionButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
