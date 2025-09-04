'use client';

import { getLast7DaysResponseCount } from '@api/get-daily-response-count';
import { getDashboardRecentSurveysServer } from '@api/get-dashboard-recent-surveys-server';
import { getSurveyMetadata } from '@api/get-survey-metadata';
import CommonText from '@components/atom/CommonText';
import Loading from '@components/atom/Loading';
import WelcomeDashboard from '@components/organism/WelcomeDashboard';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { useBlackRouter } from '@hooks/useBlackRouter';
import { useLoading } from '@hooks/useLoading';
import { BarChart, CheckCircleOutline, DonutLarge, PeopleAlt } from '@mui/icons-material';
import { Box, Card, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { MetadataStatusType } from '@share/enums/metadata-status-type';
import { SurveyStatus } from '@share/enums/survey-status';
import { useQuery } from '@tanstack/react-query';
import { LocalizationManager } from '@util/LocalizationManager';
import { useContext, useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const Dashboard = () => {
  useLoading({ forUser: true, unverifiedRoute: '/' });
  const router = useBlackRouter();
  const { isLoading } = useContext(AuthenticationContext);
  const { data: metadataData } = useQuery({
    queryKey: ['dashboard-metadata'],
    queryFn: () => getSurveyMetadata(MetadataStatusType.Dashboard),
  });
  const { data: recentSurveysData } = useQuery({
    queryKey: ['dashboard-recent-surveys'],
    queryFn: getDashboardRecentSurveysServer,
  });
  const { data: last7Days } = useQuery({
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
    return last7Days?.payload?.map((day, index) => ({
      date: day.date,
      label: ['일', '월', '화', '수', '목', '금', '토'][(currentDay + index + 1) % 7],
      responses: Math.floor(Math.random() * 50) + 10, // 임시 더미 데이터
    }));
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

  const rows: GridRowsProp =
    recentSurveysData?.payload?.map((survey) => ({
      id: survey.id,
      title: survey.title,
      hashedUniqueKey: survey.hashedUniqueKey,
      status: survey.status,
      expiresAt: survey.expiresAt,
      responses: survey.responses,
    })) ?? [];

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: '설문 제목',
      width: 200,
      renderCell: (params) => (
        <CommonText
          component="a"
          thickness="regular"
          fontSize={16}
          color="primary.main"
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          title={window.location.href + 'survey/view/' + params.row.hashedUniqueKey}
          onClick={() => {
            router.push(`/survey/view/${params.row.hashedUniqueKey}`);
          }}
        >
          {params.value}
        </CommonText>
      ),
    },
    { field: 'status', headerName: '상태', width: 100, valueFormatter: (value) => LocalizationManager.translate(value as SurveyStatus) },
    { field: 'expiresAt', headerName: '마감기한', width: 100 },
    { field: 'responses', headerName: '응답 수', width: 100 },
  ];

  if (isLoading) {
    return <Loading />;
  }

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
          {kpiData.map((item, index) => (
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
          ))}
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
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="responses"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
                    />
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
              <Stack direction="row" justifyContent="center" alignItems="center" sx={{ color: 'text.secondary', height: '100%', pb: 3 }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  density="compact"
                  slots={{
                    footer: () => null, // Render nothing for the footer
                  }}
                  sx={{
                    backgroundColor: (theme) => theme.palette.background.paper,
                    border: 'none',
                    '& .MuiDataGrid-root': {
                      outline: 'none',
                      border: 'none',
                    },
                    '& .MuiDataGrid-cell': {
                      borderBottom: 'none',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      borderBottom: 'none',
                    },
                    '& .MuiDataGrid-columnSeparator': {
                      display: 'none',
                    },
                  }}
                />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
