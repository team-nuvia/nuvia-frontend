import mutationKeys from '@/store/lib/mutation-key';
import { getUserAccesses, UserAccess } from '@api/user/get-user-accesses';
import OutlineBox from '@components/atom/OutlineBox';
import { Box, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { DateFormat } from '@util/dateFormat';
import { useEffect, useMemo, useState } from 'react';

interface LatestActiveProps {}
const LatestActive: React.FC<LatestActiveProps> = () => {
  const [page, setPage] = useState(1);
  const [accessLogs, setAccessLogs] = useState<UserAccess[]>([]);
  const { mutate: notifications, data: notificationsData } = useMutation({
    mutationKey: mutationKeys.user.latestActive(),
    mutationFn: () => getUserAccesses({ page, limit: 5 }),
    onSuccess: (data) => {
      setAccessLogs((prev) => prev.concat(data?.payload?.data ?? []));
    },
  });

  useEffect(() => {
    notifications();
  }, []);

  function loadMore() {
    setPage(page + 1);
    notifications();
  }

  const totalCount = useMemo(() => {
    return notificationsData?.payload?.total ? notificationsData.payload.total - accessLogs.length : 0;
  }, [notificationsData, accessLogs]);

  function initializePage() {
    setPage(1);
    setAccessLogs([]);
    notifications();
  }

  return (
    <Container maxWidth="md">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold" mb={3}>
          최근 활동
        </Typography>
        {accessLogs.length > 5 && (
          <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }} onClick={initializePage}>
            초기화
          </Typography>
        )}
      </Stack>
      <Stack gap={2}>
        {accessLogs.map((item) => (
          <Card variant="outlined" key={item.id}>
            <CardContent>
              <Stack gap={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack gap={1}>
                    <Typography variant="body1" fontWeight="medium">
                      {item.status === 'login' ? '로그인' : '로그아웃'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.accessIp} / {item.accessDevice}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography variant="caption" color="text.secondary" alignSelf="flex-end">
                  {item.lastAccessAt ? DateFormat.getTimeAgo(item.lastAccessAt) : '접속 기록 불명'}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
        {totalCount > 0 && (
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  총 {totalCount}개의 활동 기록
                </Typography>
                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }} onClick={loadMore}>
                  더 보기
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Container>
  );
};

export default LatestActive;
