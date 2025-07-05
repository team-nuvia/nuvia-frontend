'use client';

import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Link,
  Stack,
} from '@mui/material';
import {
  BarChart,
  CheckCircleOutline,
  DonutLarge,
  PeopleAlt,
} from '@mui/icons-material';
import NextLink from 'next/link';

// --- Mock Data ---
const kpiData = [
  {
    title: '총 설문 수',
    type: 'number',
    value: 12,
    icon: <BarChart sx={{ fontSize: 40 }} />,
    color: 'primary.main',
  },
  {
    title: '총 응답 수',
    type: 'number',
    value: 8345,
    icon: <PeopleAlt sx={{ fontSize: 40 }} />,
    color: 'success.main',
  },
  {
    title: '평균 응답률',
    type: 'percentage',
    total: 10000,
    value: 6850,
    icon: <CheckCircleOutline sx={{ fontSize: 40 }} />,
    color: 'warning.main',
  },
  {
    title: '플랜 사용량',
    type: 'percentage',
    total: 10000,
    value: 8345,
    icon: <DonutLarge sx={{ fontSize: 40 }} />,
    color: 'error.main',
  },
];

const recentSurveys = [
  {
    id: 1,
    title: '2024년 고객 만족도 조사',
    status: '진행중',
    responses: 1204,
    createdAt: '2024-06-28',
  },
  {
    id: 2,
    title: '신제품 아이디어 공모',
    status: '마감',
    responses: 350,
    createdAt: '2024-06-15',
  },
  {
    id: 3,
    title: '사내 복지 만족도 설문',
    status: '진행중',
    responses: 88,
    createdAt: '2024-07-02',
  },
  {
    id: 4,
    title: '서비스 UI/UX 개선 피드백',
    status: '초안',
    responses: 0,
    createdAt: '2024-07-04',
  },
];

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'grey.50', p: 4 }}>
      <Container maxWidth="lg">
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
            대시보드
          </Typography>
          <Button variant="contained" color="primary" size="large">
            새 설문 만들기
          </Button>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={4}>
          {kpiData.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                elevation={2}
                sx={{ display: 'flex', alignItems: 'center', p: 2 }}
              >
                <Stack
                  sx={{ mr: 2, color: item.color, fontSize: 40, width: 40 }}
                  justifyContent="center"
                  alignItems="center"
                >
                  {item.icon}
                </Stack>
                <Stack direction="column">
                  {item.type === 'number' ? (
                    <Typography variant="h6" component="div" fontWeight="bold">
                      {item.value}
                    </Typography>
                  ) : item.type === 'percentage' ? (
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Typography
                        variant="h6"
                        component="div"
                        fontWeight="bold"
                      >
                        {((item.value / (item.total ?? 1)) * 100).toFixed(1)}%
                      </Typography>
                      <Typography
                        variant="caption"
                        component="div"
                        color="text.secondary"
                      >
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
                      <TableCell align="right">응답 수</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentSurveys.map((survey) => (
                      <TableRow hover key={survey.id}>
                        <TableCell>
                          <Link
                            component={NextLink}
                            href={`/surveys/${survey.id}`}
                            underline="hover"
                          >
                            {survey.title}
                          </Link>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={survey.status}
                            size="small"
                            color={
                              survey.status === '진행중'
                                ? 'success'
                                : survey.status === '마감'
                                ? 'default'
                                : 'warning'
                            }
                          />
                        </TableCell>
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
