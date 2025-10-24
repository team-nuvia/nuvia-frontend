import { useAuthStore } from '@/store/auth.store';
import ActionButton from '@components/atom/ActionButton';
import { Card, CardContent, Container, Stack, Typography } from '@mui/material';
import { DateFormat } from '@util/dateFormat';

interface SecurityProps {}
const Security: React.FC<SecurityProps> = () => {
  const router = useAuthStore((state) => state.router)!;
  const user = useAuthStore((state) => state.user)!;

  return (
    <Container maxWidth="md">
      <Typography variant="h6" fontWeight="bold" mb={3}>
        보안 설정
      </Typography>
      <Stack spacing={3}>
        {user?.lastUpdatedAt ? (
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack spacing={1}>
                  <Typography variant="body1" fontWeight="medium">
                    비밀번호 변경
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    마지막 변경:{' '}
                    {user?.lastUpdatedAt && user?.createdAt !== user?.lastUpdatedAt ? DateFormat.getTimeAgo(user?.lastUpdatedAt, 'month') : 'N/A'}
                  </Typography>
                </Stack>
                <ActionButton
                  variant="outlined"
                  size="small"
                  onClick={() => router.push('/user/settings')}
                  onMouseEnter={() => router.prefetch('/user/settings')}
                >
                  변경
                </ActionButton>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Typography variant="body1" fontWeight="medium" color="text.secondary">
            소셜 로그인 사용자는 비밀번호 변경이 불가능합니다.
          </Typography>
        )}

        {/* <Card elevation={1} sx={{ p: 3 }}>
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
                    </Card> */}

        {/* <Card elevation={1} sx={{ p: 3 }}>
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
                    </Card> */}
      </Stack>
    </Container>
  );
};

export default Security;
