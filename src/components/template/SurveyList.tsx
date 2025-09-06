'use client';

import { getSurveyList } from '@api/get-survey-list';
import { getSurveyMetadata } from '@api/get-survey-metadata';
import ActionButton from '@components/atom/ActionButton';
import SurveyListItemCard from '@components/molecular/SurveyListItemCard';
import SurveyBinDialog from '@components/organism/SurveyBinDialog';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import { useLoading } from '@hooks/useLoading';
import { Add, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Fab,
  Grid,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography
} from '@mui/material';
import { MetadataStatusType } from '@share/enums/metadata-status-type';
import { SurveyStatus, SurveyStatusList } from '@share/enums/survey-status';
import { UserRole } from '@share/enums/user-role';
import { SearchSurvey } from '@share/interface/search-survey';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LocalizationManager } from '@util/LocalizationManager';
import { roleAtLeast } from '@util/roleAtLeast';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

export default function SurveyList() {
  useLoading({ forUser: true, unverifiedRoute: '/auth/login' });
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useContext(AuthenticationContext);
  const [surveys, setSurveys] = useState<SearchSurvey[]>([]);
  const { handleOpenDialog } = useContext(GlobalDialogContext);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>(SurveyStatusList.join(','));
  const { data, isLoading } = useQuery({
    queryKey: ['surveyList'],
    queryFn: () =>
      getSurveyList({
        page: 1,
        limit: 10,
        search: searchQuery,
        status: [SurveyStatusList.join(','), SurveyStatus.Draft, SurveyStatus.Active, SurveyStatus.Closed][selectedTab],
      }),
  });
  const { data: surveyMetadata } = useQuery({
    queryKey: ['surveyMetadata'],
    queryFn: () => getSurveyMetadata(MetadataStatusType.SurveyList),
  });

  useEffect(() => {
    if (data?.payload && !isLoading) {
      setSurveys(data.payload.data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['surveyList'] });
  }, [selectedTab]);

  const handleRedirectCreate = () => {
    router.push('/survey/create');
  };

  const handlePopTrash = () => {
    handleOpenDialog({
      title: '휴지통',
      content: <SurveyBinDialog />,
      useConfirm: false,
    });
  };

  const isFilterStatus = filterStatus.split(',').some((status) => SurveyStatusList.includes(status as SurveyStatus));
  const isAllFilterStatus = filterStatus.split(',').every((status) => SurveyStatusList.includes(status as SurveyStatus));

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          내 설문 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          생성한 설문들을 관리하고 응답을 분석해보세요
        </Typography>
      </Box>

      {/* 통계 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {surveyMetadata?.payload?.totalSurveyCount ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                총 설문 수
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {surveyMetadata?.payload?.activeSurveyCount ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                진행중인 설문
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {surveyMetadata?.payload?.totalRespondentCount ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                총 응답 수
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {surveyMetadata?.payload?.totalViewCount ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                총 조회 수
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 필터 및 검색 */}
      {/* <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <TextField
              size="small"
              placeholder="설문 제목이나 설명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                },
              }}
              sx={{ minWidth: 300, flexGrow: 1 }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>상태</InputLabel>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="상태">
                <MenuItem value={SurveyStatusList.join(',')}>전체</MenuItem>
                {SurveyStatusList.map((status) => (
                  <MenuItem key={status} value={status}>
                    {LocalizationManager.translate(status)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card> */}

      {/* 탭 */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
          <Tab label="전체" />
          {Object.values(SurveyStatus).map((status) => (
            <Tab key={status} label={LocalizationManager.translate(status)} />
          ))}
        </Tabs>
        {roleAtLeast(UserRole.Admin, user?.role) && (
          <Tooltip title="휴지통">
            <ActionButton startIcon={<Delete />} onClick={handlePopTrash} color="error" variant="outlined" shape="rounded">
              휴지통
            </ActionButton>
          </Tooltip>
        )}
      </Stack>

      {/* 설문 목록 */}
      {surveys?.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {searchQuery || isFilterStatus ? '검색 결과가 없습니다' : '아직 생성된 설문이 없습니다'}
            </Typography>
            {roleAtLeast(UserRole.Editor, user?.role) && (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  {searchQuery || !isFilterStatus ? '다른 검색어나 필터를 시도해보세요' : '첫 번째 설문을 만들어보세요'}
                </Typography>
                {!searchQuery && isAllFilterStatus && (
                  <Button variant="contained" startIcon={<Add />} onClick={handleRedirectCreate}>
                    설문 만들기
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {surveys?.map((survey) => (
              <SurveyListItemCard key={survey.id} survey={survey} />
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* FAB */}
      {roleAtLeast(UserRole.Editor, user?.role) && (
        <Tooltip title="설문 만들기">
          <Fab color="primary" sx={{ position: 'fixed', bottom: 24, right: 24 }} onClick={handleRedirectCreate}>
            <Add />
          </Fab>
        </Tooltip>
      )}
    </Container>
  );
}
