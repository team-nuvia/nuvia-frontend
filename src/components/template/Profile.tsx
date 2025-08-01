'use client';

import ActionButton from '@components/atom/ActionButton';
import { AuthenticationContext } from '@context/AuthenticationContext';
import LoadingContext from '@context/LodingContext';
import { AccountCircle, CalendarToday, Edit, Email, Person, Settings, VerifiedUser } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  ChipOwnProps,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { UserRole } from '@share/enums/user-role';
import { DateFormat } from '@util/dateFormat';
import { isNil } from '@util/isNil';
import { useRouter } from 'next/navigation';
import { useContext, useLayoutEffect, useState } from 'react';

interface ProfileProps {}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

const Profile: React.FC<ProfileProps> = () => {
  const { user } = useContext(AuthenticationContext);
  const { setLoading } = useContext(LoadingContext);
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();

  useLayoutEffect(() => {
    setLoading(true, '프로필 정보를 불러오는 중...');
    if (isNil(user)) {
      router.push('/auth/login');
    }
    setLoading(false);
  }, [user, router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getRoleColor = (role: UserRole | undefined): ChipOwnProps['color'] => {
    switch (role) {
      case UserRole.Owner:
        return 'info';
      case UserRole.Admin:
        return 'warning';
      case UserRole.Editor:
        return 'secondary';
      case UserRole.Viewer:
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: UserRole | undefined) => {
    switch (role) {
      case UserRole.Owner:
        return '소유자';
      case UserRole.Admin:
        return '관리자';
      case UserRole.Editor:
        return '편집자';
      case UserRole.Viewer:
      default:
        return '뷰어';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            프로필
          </Typography>
          <ActionButton variant="outlined" startIcon={<Settings />} size="large" onClick={() => router.push('/user/settings')}>
            설정
          </ActionButton>
        </Box>

        <Grid container spacing={4}>
          {/* Profile Card */}
          <Grid size={{ xs: 12, md: 4 }}>
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
                    <Chip
                      icon={<VerifiedUser />}
                      label={getRoleLabel(user?.role || UserRole.Viewer)}
                      color={getRoleColor(user?.role || UserRole.Viewer)}
                      size="small"
                    />
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

                  <Button variant="contained" startIcon={<Edit />} fullWidth size="large">
                    프로필 편집
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={2}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs" sx={{ px: 3 }}>
                  <Tab label="개요" {...a11yProps(0)} />
                  <Tab label="활동" {...a11yProps(1)} />
                  <Tab label="보안" {...a11yProps(2)} />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
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
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              권한
                            </Typography>
                            <Chip label={getRoleLabel(user?.role)} color={getRoleColor(user?.role)} size="small" />
                          </Box>
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
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Container maxWidth="md">
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    최근 활동
                  </Typography>
                  <Stack spacing={2}>
                    {[1, 2, 3].map((item) => (
                      <Card key={item} elevation={1} sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack spacing={1}>
                            <Typography variant="body1" fontWeight="medium">
                              설문 응답 완료
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              "2024년 고객 만족도 조사" 설문에 응답했습니다.
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {item}일 전
                          </Typography>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                </Container>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Container maxWidth="md">
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    보안 설정
                  </Typography>
                  <Stack spacing={3}>
                    <Card elevation={1} sx={{ p: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack spacing={1}>
                          <Typography variant="body1" fontWeight="medium">
                            비밀번호 변경
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            마지막 변경: 30일 전
                          </Typography>
                        </Stack>
                        <Button variant="outlined" size="small">
                          변경
                        </Button>
                      </Stack>
                    </Card>

                    <Card elevation={1} sx={{ p: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack spacing={1}>
                          <Typography variant="body1" fontWeight="medium">
                            이중 인증
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            계정 보안을 강화하세요
                          </Typography>
                        </Stack>
                        <Button variant="outlined" size="small">
                          설정
                        </Button>
                      </Stack>
                    </Card>

                    <Card elevation={1} sx={{ p: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack spacing={1}>
                          <Typography variant="body1" fontWeight="medium">
                            로그인 세션
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            현재 활성 세션: 1개
                          </Typography>
                        </Stack>
                        <Button variant="outlined" size="small">
                          관리
                        </Button>
                      </Stack>
                    </Card>
                  </Stack>
                </Container>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;
