'use client';

import { getLast7DaysResponseCount } from '@api/get-daily-response-count';
import { getSurveyMetadata } from '@api/get-survey-metadata';
import RecentSurveyData from '@components/molecular/RecentSurveyData';
import WelcomeDashboard from '@components/organism/WelcomeDashboard';
import { BarChart, CheckCircleOutline, DonutLarge, PeopleAlt } from '@mui/icons-material';
import { Box, Card, Container, Grid, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { MetadataStatusType } from '@share/enums/metadata-status-type';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const Dashboard = () => {
  const { data: metadataData, isLoading: metadataLoading } = useQuery({
    queryKey: ['dashboard-metadata'],
    queryFn: () => getSurveyMetadata(MetadataStatusType.Dashboard),
  });

  const { data: last7Days, isLoading: last7DaysLoading } = useQuery({
    queryKey: ['daily-response-count'],
    queryFn: getLast7DaysResponseCount,
  });

  // 7일간 응답 추이 데이터 생성
  const responseTrendData = useMemo(() => {
    // 실제 API 데이터가 있으면 사용, 없으면 더미 데이터 표시
    const currentDay = new Date().getDay();
    if (last7Days?.payload) {
      return last7Days.payload.map((day, index) => ({
        date: day.date,
        label: ['일', '월', '화', '수', '목', '금', '토'][(currentDay + index + 1) % 7],
        responses: day.count,
      }));
    }

    // API 데이터가 로딩 중이거나 없을 때는 더미 데이터로 표시
    return [];
  }, [last7Days]);

  const kpiData = useMemo(() => {
    const totalCompletedRespondentCount = metadataData?.payload?.totalCompletedRespondentCount ?? 0;
    const totalRespondentCount = metadataData?.payload?.totalRespondentCount ?? 0;
    return [
      {
        title: '총 설문 수',
        type: 'number',
        total: 0,
        value: metadataData?.payload?.totalSurveyCount ?? 0,
        icon: <BarChart sx={{ fontSize: 40 }} />,
        color: 'primary.main',
      },
      {
        title: '총 응답 수',
        type: 'number',
        total: 0,
        value: totalRespondentCount,
        icon: <PeopleAlt sx={{ fontSize: 40 }} />,
        color: 'success.main',
      },
      {
        title: '플랜 사용량',
        type: 'percentage',
        total: metadataData?.payload?.planUsage.limit ?? 0,
        value: metadataData?.payload?.planUsage.usage ?? 0,
        icon: <DonutLarge sx={{ fontSize: 40 }} />,
        color: 'error.main',
      },
      {
        title: '평균 응답율',
        type: 'percentage',
        total: totalRespondentCount,
        value: totalCompletedRespondentCount,
        icon: <CheckCircleOutline sx={{ fontSize: 40 }} />,
        color: 'warning.main',
      },
    ];
  }, [metadataData]);

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Stack direction="row" alignItems="center" gap={1}>
            <WelcomeDashboard />
          </Stack>
        </Stack>

        {/* KPI Cards */}
        <Grid container spacing={4}>
          {metadataLoading ? (
            <>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Skeleton variant="rectangular" height={77} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Skeleton variant="rectangular" height={77} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Skeleton variant="rectangular" height={77} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Skeleton variant="rectangular" height={77} />
              </Grid>
            </>
          ) : (
            kpiData.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Stack sx={{ mr: 2, color: item.color, fontSize: 40, width: 40 }} justifyContent="center" alignItems="center">
                    {item.icon}
                  </Stack>
                  <Stack direction="column">
                    {item.type === 'number' ? (
                      <Typography variant="h6" component="div" fontWeight="bold">
                        {item.value}
                      </Typography>
                    ) : item.type === 'percentage' ? (
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography variant="h6" component="div" fontWeight="bold">
                          {`${((item.value / item.total) * 100 || 0).toFixed(1)}%`}
                        </Typography>
                        <Typography variant="caption" component="div" color="text.secondary">
                          {item.value}/{item.total}
                        </Typography>
                      </Stack>
                    ) : (
                      <Typography variant="h6" component="div" fontWeight="bold">
                        {item.value}
                      </Typography>
                    )}

                    <Typography variant="body2" color="text.secondary">
                      {item.title}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
        {/* Main Content */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Response Trends Chart */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={2} sx={{ p: 3, height: 420, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                최근 7일간 응답 추이
              </Typography>
              <Stack direction="row" justifyContent="center" alignItems="center" pb={3} sx={{ color: 'text.secondary', height: '100%' }}>
                {/* TODO: Chart.js 또는 Recharts와 같은 라이브러리를 사용하여 차트 구현 */}
                {/* <Typography>차트가 여기에 표시됩니다.</Typography> */}
                {/* 최근 7일간 응답 추이 차트 - rechart로 작성 */}

                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(value: any) => [`${value}개`, '응답 수']}
                      labelFormatter={(label, payload) => `${label} (${payload?.[0]?.payload?.date})`}
                    />
                    {last7DaysLoading ? (
                      <Typography>Loading...</Typography>
                    ) : (
                      <>
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="responses"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
                        />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </Stack>
            </Paper>
          </Grid>

          {/* Recent Surveys Table */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={2} sx={{ p: 3, height: 420, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                최근 설문
              </Typography>
              <Stack direction="row" justifyContent="center" alignItems="center" sx={{ color: 'text.secondary' }}>
                <RecentSurveyData />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
