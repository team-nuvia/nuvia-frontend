import { GetMeResponse } from '@/models/GetMeResponse';
import { CalendarToday, Person } from '@mui/icons-material';
import { Box, Card, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import { DateFormat } from '@util/dateFormat';

interface AccountOverviewProps {
  user: GetMeResponse | null;
}
const AccountOverview: React.FC<AccountOverviewProps> = ({ user }) => {
  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card elevation={1} sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                }}
              >
                <Person />
              </Box>
              <Typography variant="h6" fontWeight="bold">
                기본 정보
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  이름
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {user?.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  이메일
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {user?.email}
                </Typography>
              </Box>
              {/* <Box>
                            <Typography variant="body2" color="text.secondary">
                              권한
                            </Typography>
                            <Chip label={getRoleLabel(user?.role)} color={getRoleColor(user?.role)} size="small" />
                          </Box> */}
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Card elevation={1} sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'success.light',
                  color: 'success.contrastText',
                }}
              >
                <CalendarToday />
              </Box>
              <Typography variant="h6" fontWeight="bold">
                계정 정보
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  가입일
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {DateFormat.toKST('YYYY-MM-dd', user?.createdAt)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  최근 접속
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {DateFormat.toKST('YYYY-MM-dd HH:mm', user?.updatedAt)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  계정 상태
                </Typography>
                <Chip label="활성" color="success" size="small" />
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountOverview;
