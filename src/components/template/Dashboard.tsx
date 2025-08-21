'use client';

import { getDashboardRecentSurveysServer } from '@api/get-dashboard-recent-surveys-server';
import { getSurveyMetadata } from '@api/get-survey-metadata';
import { SURVEY_STATUS_LABELS } from '@common/variables';
import ActionButton from '@components/atom/ActionButton';
import UserOrganizationSelect from '@components/molecular/UserOrganizationSelect';
import LoadingContext from '@context/LodingContext';
import { Add, BarChart, CheckCircleOutline, DonutLarge, PeopleAlt } from '@mui/icons-material';
import {
  Box,
  Card,
  Chip,
  Container,
  Grid,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { MetadataStatusType } from '@share/enums/metadata-status-type';
import { useQuery } from '@tanstack/react-query';
import { DateFormat } from '@util/dateFormat';
import { getSurveyStatusColor } from '@util/getSurveyStatusColor';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useLayoutEffect, useMemo } from 'react';

const Dashboard = () => {
  const router = useRouter();
  const { endLoading } = useContext(LoadingContext);
  const { data: metadataData, refetch: refetchMetadata } = useQuery({
    queryKey: ['dashboard-metadata'],
    queryFn: () => getSurveyMetadata(MetadataStatusType.Dashboard),
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  });
  const { data: recentSurveysData, refetch: refetchRecentSurveys } = useQuery({
    queryKey: ['dashboard-recent-surveys'],
    queryFn: getDashboardRecentSurveysServer,
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  });

  useLayoutEffect(() => {
    if (metadataData?.payload && recentSurveysData?.payload) {
      endLoading();
    }
  }, [metadataData, recentSurveysData]);

  const kpiData = useMemo(() => {
    const currentMonthRespondentCount = metadataData?.payload?.respondentIncreaseRate.currentMonthRespondentCount ?? 0;
    const previousMonthRespondentCount = metadataData?.payload?.respondentIncreaseRate.previousMonthRespondentCount ?? 0;
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
        title: '1개월 응답 증가율',
        type: 'percentage',
        total: previousMonthRespondentCount,
        value: currentMonthRespondentCount - previousMonthRespondentCount,
        icon: <CheckCircleOutline sx={{ fontSize: 40 }} />,
        color: 'warning.main',
      },
      {
        title: '응답 증감율',
        type: 'percentage',
        total: currentMonthRespondentCount + previousMonthRespondentCount,
        value: currentMonthRespondentCount - previousMonthRespondentCount,
        icon: <CheckCircleOutline sx={{ fontSize: 40 }} />,
        color: 'warning.main',
      },
    ];
  }, [metadataData]);

  const refetchDashboardData = useCallback(() => {
    refetchMetadata();
    refetchRecentSurveys();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'grey.50', p: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              대시보드
            </Typography>
            <UserOrganizationSelect refetchCallback={refetchDashboardData} />
          </Stack>
          <ActionButton
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Add />}
            onClick={() => {
              router.push('/survey/create');
            }}
          >
            새 설문 만들기
          </ActionButton>
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
                      {item.total === 0 ? (
                        <Typography variant="h6" component="div" fontWeight="bold">
                          데이터 부족
                        </Typography>
                      ) : (
                        <>
                          <Typography variant="h6" component="div" fontWeight="bold">
                            {`${((item.value / item.total) * 100 || 0).toFixed(1)}%`}
                          </Typography>
                          <Typography variant="caption" component="div" color="text.secondary">
                            {item.value}/{item.total}
                          </Typography>
                        </>
                      )}
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
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper elevation={2} sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                응답 트렌드
              </Typography>
              <Box
                sx={{
                  height: 'calc(100% - 48px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                {/* TODO: Chart.js 또는 Recharts와 같은 라이브러리를 사용하여 차트 구현 */}
                <Typography>차트가 여기에 표시됩니다.</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Surveys Table */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={2} sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                최근 설문
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>설문 제목</TableCell>
                      <TableCell align="center">상태</TableCell>
                      <TableCell align="center">마감기한</TableCell>
                      <TableCell align="right">응답 수</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentSurveysData?.payload?.map((survey) => (
                      <TableRow hover key={survey.id}>
                        <TableCell>
                          <Link component={NextLink} href={`/survey/view/${survey.hashedUniqueKey}`} underline="hover">
                            {survey.title}
                          </Link>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={SURVEY_STATUS_LABELS[survey.status]} size="small" color={getSurveyStatusColor(survey.status)} />
                        </TableCell>
                        <TableCell align="center">{survey.expiresAt ? DateFormat.toKST('YYYY-MM-dd HH:mm', survey.expiresAt) : '기한없음'}</TableCell>
                        <TableCell align="right">{survey.responses}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
