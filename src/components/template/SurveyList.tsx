'use client';

import LoadingContext from '@/context/LodingContext';
import { getSurveyList } from '@api/get-survey-list';
import SurveyListItemCard from '@components/molecular/SurveyListItemCard';
import { Add, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Fab,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { SurveyStatus } from '@share/enums/survey-status';
import { SearchSurvey } from '@share/interface/search-survey';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';

export default function SurveyList() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<SearchSurvey[]>([]);
  const { endLoading } = useContext(LoadingContext);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { data, refetch, isLoading } = useQuery({
    queryKey: ['surveyList'],
    queryFn: () =>
      getSurveyList({ page: 1, limit: 10, search: '', status: ['all', SurveyStatus.Active, SurveyStatus.Draft, SurveyStatus.Closed][selectedTab] }),
  });

  useLayoutEffect(() => {
    if (data?.payload && !isLoading) {
      setSurveys(data.payload.data);
      endLoading();
    }
  }, [data, isLoading]);

  useEffect(() => {
    refetch();
  }, [selectedTab]);

  const handleRedirectCreate = () => {
    router.push('/survey/create');
  };

  const totalResponses = surveys?.reduce((sum, survey) => sum + survey.responseAmount, 0) ?? 0;
  const activeSurveys = surveys?.filter((s) => s.status === 'active').length ?? 0;
  const totalViews = surveys?.reduce((sum, survey) => sum + survey.viewCount, 0) ?? 0;

  return (
    <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
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
                {surveys?.length ?? 0}
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
                {activeSurveys}
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
                {totalResponses.toLocaleString()}
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
                {totalViews.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                총 조회 수
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 필터 및 검색 */}
      <Card sx={{ mb: 4 }}>
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
                <MenuItem value={'all'}>전체</MenuItem>
                <MenuItem value={SurveyStatus.Active}>진행중</MenuItem>
                <MenuItem value={SurveyStatus.Draft}>초안</MenuItem>
                <MenuItem value={SurveyStatus.Closed}>종료</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* 탭 */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
          <Tab label="전체" />
          <Tab label="진행중" />
          <Tab label="초안" />
          <Tab label="종료" />
        </Tabs>
      </Box>

      {/* 설문 목록 */}
      {surveys?.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {searchQuery || filterStatus !== 'all' ? '검색 결과가 없습니다' : '아직 생성된 설문이 없습니다'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {searchQuery || filterStatus !== 'all' ? '다른 검색어나 필터를 시도해보세요' : '첫 번째 설문을 만들어보세요'}
            </Typography>
            {!searchQuery && filterStatus === 'all' && (
              <Button variant="contained" startIcon={<Add />} onClick={handleRedirectCreate}>
                설문 만들기
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {surveys?.map((survey) => (
              <SurveyListItemCard key={survey.id} survey={survey} refetchSurveyList={refetch} />
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* FAB */}
      <Tooltip title="설문 만들기">
        <Fab color="primary" sx={{ position: 'fixed', bottom: 24, right: 24 }} onClick={handleRedirectCreate}>
          <Add />
        </Fab>
      </Tooltip>
    </Container>
  );
}
