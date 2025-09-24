import { getNotifications } from '@api/get-notifications';
import { Card, Container, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { DateFormat } from '@util/dateFormat';

interface LatestActiveProps {}
const LatestActive: React.FC<LatestActiveProps> = () => {
  const { data: notifications } = useQuery({
    queryKey: ['latest-active'],
    queryFn: () => getNotifications({ page: 1, limit: 10 }),
  });

  return (
    <Container maxWidth="md">
      <Typography variant="h6" fontWeight="bold" mb={3}>
        최근 활동
      </Typography>
      <Stack spacing={2}>
        {notifications?.payload?.data?.map((item) => (
          <Card key={item.id} elevation={1} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack spacing={1}>
                  <Typography variant="body1" fontWeight="medium">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.content}
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="caption" color="text.secondary" alignSelf="flex-end">
                {DateFormat.getTimeAgo(item.createdAt)}
              </Typography>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default LatestActive;
