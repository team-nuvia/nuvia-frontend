'use client';

import LoadingContext from '@/context/LodingContext';
import { deleteSurvey } from '@api/delete-survey';
import { getSurveyList } from '@api/get-survey-list';
import { toggleSurveyVisibility } from '@api/toggle-survey-visibility';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import {
  Add,
  Analytics,
  ContentCopy,
  Delete,
  Edit,
  MoreVert,
  People,
  Schedule,
  Search,
  Share,
  TrendingUp,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Fab,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { SurveyStatus } from '@share/enums/survey-status';
import { SearchSurvey } from '@share/interface/search-survey';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';

export default function SurveyList() {
  const theme = useTheme();
  const router = useRouter();
  const [surveys, setSurveys] = useState<SearchSurvey[]>([]);
  const { endLoading } = useContext(LoadingContext);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<SearchSurvey | null>(null);
  const { handleOpenDialog } = useContext(GlobalDialogContext);
  const { addNotice } = useContext(GlobalSnackbarContext);
  const { data, refetch, isLoading } = useQuery({
    queryKey: ['surveyList'],
    queryFn: () =>
      getSurveyList({ page: 1, limit: 10, search: '', status: ['all', SurveyStatus.Active, SurveyStatus.Draft, SurveyStatus.Closed][selectedTab] }),
  });
  const { mutate: mutateToggleVisibility } = useMutation({
    mutationKey: ['toggleVisibility', selectedSurvey?.id],
    mutationFn: toggleSurveyVisibility,
    onSuccess: () => {
      addNotice(`설문이 ${selectedSurvey?.isPublic ? '비활성화' : '활성화'}되었습니다`, 'success');
      refetch();
    },
    onError: () => {
      addNotice('설문 활성화에 실패했습니다', 'error');
    },
  });
  const { mutate: mutateDeleteSurvey } = useMutation({
    mutationKey: ['deleteSurvey', selectedSurvey?.id],
    mutationFn: deleteSurvey,
    onSuccess: () => {
      addNotice('설문이 삭제되었습니다', 'success');
      refetch();
    },
    onError: () => {
      addNotice('설문 삭제에 실패했습니다', 'error');
    },
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, survey: SearchSurvey) => {
    setAnchorEl(event.currentTarget);
    setSelectedSurvey(survey);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSurvey(null);
  };

  const handleEdit = () => {
    if (selectedSurvey) {
      router.push(`/survey/create?edit=${selectedSurvey.id}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    handleOpenDialog('설문 삭제', '삭제된 설문은 복구 불가합니다. 삭제하시겠습니까?\n복구 가능한 구독제는 설명을 참조해주세요.', confirmDelete);
    handleMenuClose();
  };

  const handleShare = () => {
    handleOpenDialog(
      '설문 공유',
      <>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          아래 링크를 복사하여 설문을 공유하세요
        </Typography>
        <TextField
          fullWidth
          value={selectedSurvey ? `${window.location.origin}/survey/${selectedSurvey.id}` : ''}
          slotProps={{
            input: {
              readOnly: true,
              endAdornment: (
                <IconButton onClick={handleCopyLink}>
                  <ContentCopy />
                </IconButton>
              ),
            },
          }}
        />
      </>,
    );
    handleMenuClose();
  };

  const handleViewResults = () => {
    if (selectedSurvey) {
      router.push(`/survey/${selectedSurvey.id}/results`);
    }
    handleMenuClose();
  };

  const handleToggleVisibility = () => {
    if (selectedSurvey) {
      const newStatus = !selectedSurvey.isPublic;
      mutateToggleVisibility({ surveyId: selectedSurvey.id, isPublic: newStatus });
    }
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (selectedSurvey) {
      mutateDeleteSurvey({ surveyId: selectedSurvey.id.toString() });
    }
    setSelectedSurvey(null);
  };

  const handleCopyLink = () => {
    if (selectedSurvey) {
      const link = `${window.location.origin}/survey/${selectedSurvey.id}`;
      navigator.clipboard.writeText(link);
      addNotice('링크가 복사되었습니다', 'success');
    }
  };

  const getStatusColor = (status: SearchSurvey['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: SearchSurvey['status']) => {
    switch (status) {
      case 'active':
        return '진행중';
      case 'draft':
        return '초안';
      case 'closed':
        return '종료';
      default:
        return status;
    }
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
              <Button variant="contained" startIcon={<Add />} onClick={() => router.push('/survey/create')}>
                설문 만들기
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {surveys?.map((survey) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={survey.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* 헤더 */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Chip label={getStatusText(survey.status)} color={getStatusColor(survey.status) as any} size="small" />
                          {survey.isPublic ? (
                            <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                          ) : (
                            <VisibilityOff sx={{ fontSize: 16, color: 'text.secondary' }} />
                          )}
                        </Box>
                        <IconButton size="small" onClick={(e) => handleMenuClick(e, survey)}>
                          <MoreVert />
                        </IconButton>
                      </Box>

                      {/* 제목 및 설명 */}
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, lineHeight: 1.3 }}>
                        {survey.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {survey.description}
                      </Typography>

                      {/* 통계 */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 6 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {survey.responseAmount}명 응답
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <TrendingUp sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {survey.viewCount}회 조회
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              약 {survey.estimatedTime}분
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            {survey.questionAmount}개 질문
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* 카테고리 */}
                      <Chip label={survey.category.name} size="small" variant="outlined" sx={{ mb: 2 }} />

                      {/* 날짜 */}
                      <Typography variant="caption" color="text.secondary">
                        생성일: {new Date(survey.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>

                    {/* 액션 버튼 */}
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => router.push(`/survey/create?edit=${survey.id}`)}
                          sx={{ flexGrow: 1 }}
                        >
                          편집
                        </Button>
                        {survey.responseAmount > 0 && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Analytics />}
                            onClick={() => router.push(`/survey/${survey.id}/results`)}
                            sx={{ flexGrow: 1 }}
                          >
                            결과보기
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* FAB */}
      <Tooltip title="설문 만들기">
        <Fab color="primary" sx={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => router.push('/survey/create')}>
          <Add />
        </Fab>
      </Tooltip>

      {/* 메뉴 */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 2 }} />
          편집
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <Share sx={{ mr: 2 }} />
          공유
        </MenuItem>
        {selectedSurvey && selectedSurvey.responseAmount > 0 && (
          <MenuItem onClick={handleViewResults}>
            <Analytics sx={{ mr: 2 }} />
            결과 보기
          </MenuItem>
        )}
        <MenuItem onClick={handleToggleVisibility}>
          {selectedSurvey?.isPublic ? (
            <>
              <VisibilityOff sx={{ mr: 2 }} />
              비활성화
            </>
          ) : (
            <>
              <Visibility sx={{ mr: 2 }} />
              활성화
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 2 }} />
          삭제
        </MenuItem>
      </Menu>

      {/* 삭제 확인 다이얼로그 */}
      {/* <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>설문 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            "{selectedSurvey?.title}" 설문을 정말 삭제하시겠습니까?
            <br />
            삭제된 설문과 모든 응답 데이터는 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* 공유 다이얼로그 */}
      {/* <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>설문 공유</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            아래 링크를 복사하여 설문을 공유하세요
          </Typography>
          <TextField
            fullWidth
            value={selectedSurvey ? `${window.location.origin}/survey/${selectedSurvey.id}` : ''}
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={handleCopyLink}>
                    <ContentCopy />
                  </IconButton>
                ),
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>닫기</Button>
          <Button onClick={handleCopyLink} variant="contained">
            링크 복사
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      /> */}
    </Container>
  );
}
