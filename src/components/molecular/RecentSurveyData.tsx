import { useAuthStore } from '@/store/auth.store';
import queryKeys from '@/store/lib/query-key';
import { getDashboardRecentSurveysServer } from '@api/survey/get-dashboard-recent-surveys-server';
import CommonText from '@components/atom/CommonText';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { SurveyStatus } from '@share/enums/survey-status';
import { useQuery } from '@tanstack/react-query';
import { LocalizationManager } from '@util/LocalizationManager';
import { memo, useMemo } from 'react';

interface RecentSurveyDataProps {}
const RecentSurveyData: React.FC<RecentSurveyDataProps> = () => {
  const router = useAuthStore((state) => state.router)!;
  const user = useAuthStore((state) => state.user);
  const { data: recentSurveysData, isLoading: recentSurveysLoading } = useQuery({
    queryKey: queryKeys.dashboard.recentSurvey(),
    queryFn: getDashboardRecentSurveysServer,
  });
  const rows: GridRowsProp = useMemo<GridRowsProp>(() => {
    if (!recentSurveysData?.payload) {
      return [];
    }

    return recentSurveysData.payload.map((survey) => ({
      id: survey.id,
      title: survey.title,
      hashedUniqueKey: survey.hashedUniqueKey,
      status: survey.status,
      expiresAt: survey.expiresAt,
      responses: survey.responses,
    }));
  }, [recentSurveysData?.payload, user]);

  const columns: GridColDef[] = useMemo(
    () => [
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
    ],
    [],
  );

  if (recentSurveysLoading) {
    return null;
  }

  return (
    <DataGrid
      loading={recentSurveysLoading}
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
