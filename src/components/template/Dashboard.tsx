'use client';

import CommonText from '@components/atom/CommonText';
import RedirectionButton from '@components/atom/RedirectionButton';
import StatisticsCard from '@components/molecular/StatisticsCard';
import { Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface DashboardProps {}
const Dashboard: React.FC<DashboardProps> = () => {
  // const { data: user, isError } = useUser();
  return (
    <Stack flex={1} gap={10} p={5}>
      {/* Section 1 */}
      <Stack gap={5}>
        <Stack gap={1}>
          <CommonText>대시보드</CommonText>
          <CommonText>오늘은 어떤 설문조사를 진행할까요?</CommonText>
        </Stack>
        <Stack direction="row" gap={3}>
          <StatisticsCard title={12} description="총 설문 수" />
          <StatisticsCard title={1824} description="총 응답 수" />
          <StatisticsCard
            title="설문지 만들기"
            description="설문을 만들고 쉽게 공유하세요."
            action={
              <RedirectionButton
                color="primary"
                variant="contained"
                label="추가"
                to="/survey/form"
                startIcon={<AddIcon />}
              />
            }
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Dashboard;
