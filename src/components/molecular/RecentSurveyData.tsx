import { useAuthStore } from '@/store/auth.store';
import queryKeys from '@/store/lib/query-key';
import { getDashboardRecentSurveys } from '@api/survey/get-dashboard-recent-surveys';
import { Skeleton, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { SurveyStatus } from '@share/enums/survey-status';
import { useQuery } from '@tanstack/react-query';
import { LocalizationManager } from '@util/LocalizationManager';
import Link from 'next/link';
import { memo, useMemo } from 'react';

interface RecentSurveyDataProps {}
const RecentSurveyData: React.FC<RecentSurveyDataProps> = () => {
  const router = useAuthStore((state) => state.router)!;
  const user = useAuthStore((state) => state.user);
  const { data: recentSurveysData, isLoading: recentSurveysLoading } = useQuery({
    queryKey: queryKeys.dashboard.recentSurvey(),
    queryFn: getDashboardRecentSurveys,
    enabled: !!user,
  });
  const rows: GridRowsProp = useMemo<GridRowsProp>(() => {
    if (!recentSurveysData || !recentSurveysData.payload) {
      return [];
    }

    return recentSurveysData.payload.map((survey) => ({
      id: survey.id,
      title: survey.title,
      hashedUniqueKey: survey.hashedUniqueKey,
      status: survey.status,
      userName: survey.author?.name,
      responses: survey.responses,
    }));
  }, [recentSurveysData?.payload]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'title',
        headerName: '설문 제목',
        width: 200,
        renderCell: (params) => (
          <Typography
            component={Link}
            href={`/survey/view/${params.row.hashedUniqueKey}`}
            variant="body1"
            color="primary.main"
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onMouseEnter={() => {
              router?.prefetch(`/survey/view/${params.row.hashedUniqueKey}`);
            }}
          >
            {params.value}
          </Typography>
        ),
      },
      { field: 'status', headerName: '상태', width: 100, valueFormatter: (value) => LocalizationManager.translate(value as SurveyStatus) },
      { field: 'userName', headerName: '작성자', width: 100 },
      { field: 'responses', headerName: '응답 수', width: 100, valueFormatter: (value: number) => value.toLocaleString() + ' 명' },
    ],
    [],
  );

  if (!recentSurveysData || recentSurveysLoading) {
    return (
      <Stack width="100%" gap={1} position="relative" p={1}>
        <Skeleton variant="rectangular" width="100%" height={194} sx={{ position: 'absolute', left: 0, top: 0 }} />
        <Skeleton variant="rounded" animation="wave" width="100%" height={39} />
        <Skeleton variant="rounded" animation="wave" width="100%" height={39} />
      </Stack>
    );
  }

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      density="compact"
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5, 10, 20]}
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
  );
};

export default memo(RecentSurveyData);
