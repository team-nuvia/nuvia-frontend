'use client';

import LoadingContext from '@/context/LodingContext';
import { SearchSurvey } from '@models/interface/search-survey';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  Menu,
  MenuItem,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useContext, useEffect, useState } from 'react';

// interface Survey {
//   id: string
//   title: string
//   description: string
//   status: "draft" | "active" | "closed"
//   responses: number
//   views: number
//   createdAt: string
//   updatedAt: string
//   estimatedTime: number
//   questions: number
//   category: string
//   isPublic: boolean
// }

// Mock data
const mockSurveys: SearchSurvey[] = [
  {
    id: 1,
    title: '2024 고객 만족도 조사',
    description: '고객 서비스 품질 개선을 위한 만족도 조사입니다.',
    status: 'active',
    responses: 1247,
    views: 2834,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    estimatedTime: 5,
    questions: 10,
    category: '고객 서비스',
    isPublic: true,
  },
  {
    id: 2,
    title: '신제품 출시 전 사용자 피드백',
    description: '새로운 기능에 대한 사용자들의 의견을 수집합니다.',
    status: 'active',
    responses: 456,
    views: 1203,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    estimatedTime: 3,
    questions: 5,
    category: '제품 개발',
    isPublic: false,
  },
  {
    id: 3,
    title: '직원 만족도 설문',
    description: '회사 내부 직원들의 만족도를 측정하는 설문입니다.',
    status: 'draft',
    responses: 0,
    views: 0,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
    estimatedTime: 7,
    questions: 12,
    category: '인사',
    isPublic: false,
  },
  {
    id: 4,
    title: '웹사이트 사용성 테스트',
    description: '웹사이트 개편 후 사용자 경험 평가를 위한 설문입니다.',
    status: 'closed',
    responses: 892,
    views: 1567,
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2024-01-05'),
    estimatedTime: 4,
    questions: 10,
    category: 'UX/UI',
    isPublic: true,
  },
  {
    id: 5,
    title: '마케팅 캠페인 효과 분석',
    description: '최근 마케팅 캠페인의 효과를 측정하는 설문입니다.',
    status: 'active',
    responses: 234,
    views: 678,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
    estimatedTime: 6,
    questions: 8,
    category: '마케팅',
    isPublic: true,
  },
];

export default function SurveyList() {
  const theme = useTheme();
  const router = useRouter();
  const [surveys, setSurveys] = useState<SearchSurvey[]>([]);
  // const [loading, setLoading] = useState(true);
  const { setLoading } = useContext(LoadingContext);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<SearchSurvey | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    setLoading(true, '설문 목록을 불러오는 중...');
    const loadSurveys = async () => {
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSurveys(mockSurveys);
      } catch (error) {
        console.error('Failed to load surveys:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSurveys();
  }, []);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    survey: SearchSurvey,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedSurvey(survey);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSurvey(null);
  };

  const handleEdit = () => {
    if (selectedSurvey) {
      router.push(`/create?edit=${selectedSurvey.id}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleShare = () => {
    setShareDialogOpen(true);
    handleMenuClose();
  };

  const handleViewResults = () => {
    if (selectedSurvey) {
      router.push(`/survey/${selectedSurvey.id}/results`);
    }
    handleMenuClose();
  };

  const handleToggleStatus = () => {
    if (selectedSurvey) {
      const newStatus =
        selectedSurvey.status === 'active' ? 'closed' : 'active';
      setSurveys(
        surveys.map((s) =>
          s.id === selectedSurvey.id
            ? { ...s, status: newStatus as SearchSurvey['status'] }
            : s,
        ),
      );
      setSnackbarMessage(
        `설문이 ${newStatus === 'active' ? '활성화' : '비활성화'}되었습니다`,
      );
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (selectedSurvey) {
      setSurveys(surveys.filter((s) => s.id !== selectedSurvey.id));
      setSnackbarMessage('설문이 삭제되었습니다');
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setSelectedSurvey(null);
  };

  const handleCopyLink = () => {
    if (selectedSurvey) {
      const link = `${window.location.origin}/survey/${selectedSurvey.id}`;
      navigator.clipboard.writeText(link);
      setSnackbarMessage('링크가 복사되었습니다');
      setSnackbarOpen(true);
    }
    setShareDialogOpen(false);
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

  const filteredSurveys = surveys.filter((survey) => {
    const matchesSearch =
      survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || survey.status === filterStatus;
    const matchesTab =
      selectedTab === 0 ||
      (selectedTab === 1 && survey.status === 'active') ||
      (selectedTab === 2 && survey.status === 'draft') ||
      (selectedTab === 3 && survey.status === 'closed');

    return matchesSearch && matchesStatus && matchesTab;
  });

  const totalResponses = surveys.reduce(
    (sum, survey) => sum + survey.responses,
    0,
  );
  const activeSurveys = surveys.filter((s) => s.status === 'active').length;
  const totalViews = surveys.reduce((sum, survey) => sum + survey.views, 0);

  const estimatedTime = surveys.reduce((sum, survey) => {
    const questions = survey.questions;
    const estimatedTime = questions * 0.5;
    return sum + estimatedTime;
  }, 0);

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
                {surveys.length}
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
                  startAdornment: (
                    <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
                },
              }}
              sx={{ minWidth: 300, flexGrow: 1 }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>상태</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="상태"
              >
                <MenuItem value="all">전체</MenuItem>
                <MenuItem value="active">진행중</MenuItem>
                <MenuItem value="draft">초안</MenuItem>
                <MenuItem value="closed">종료</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* 탭 */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
        >
          <Tab label="전체" />
          <Tab label="진행중" />
          <Tab label="초안" />
          <Tab label="종료" />
        </Tabs>
      </Box>

      {/* 설문 목록 */}
      {filteredSurveys.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {searchQuery || filterStatus !== 'all'
                ? '검색 결과가 없습니다'
                : '아직 생성된 설문이 없습니다'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {searchQuery || filterStatus !== 'all'
                ? '다른 검색어나 필터를 시도해보세요'
                : '첫 번째 설문을 만들어보세요'}
            </Typography>
            {!searchQuery && filterStatus === 'all' && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => router.push('/create')}
              >
                설문 만들기
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredSurveys.map((survey) => (
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
                          <Chip
                            label={getStatusText(survey.status)}
                            color={getStatusColor(survey.status) as any}
                            size="small"
                          />
                          {survey.isPublic ? (
                            <Visibility
                              sx={{ fontSize: 16, color: 'text.secondary' }}
                            />
                          ) : (
                            <VisibilityOff
                              sx={{ fontSize: 16, color: 'text.secondary' }}
                            />
                          )}
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, survey)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>

                      {/* 제목 및 설명 */}
                      <Typography
                        variant="h6"
                        sx={{ mb: 1, fontWeight: 600, lineHeight: 1.3 }}
                      >
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
                            <People
                              sx={{ fontSize: 16, color: 'text.secondary' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {survey.responses}명 응답
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
                            <TrendingUp
                              sx={{ fontSize: 16, color: 'text.secondary' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {survey.views}회 조회
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
                            <Schedule
                              sx={{ fontSize: 16, color: 'text.secondary' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              약 {estimatedTime}분
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            {survey.questions}개 질문
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* 카테고리 */}
                      <Chip
                        label={survey.category}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />

                      {/* 날짜 */}
                      <Typography variant="caption" color="text.secondary">
                        생성일:{' '}
                        {new Date(survey.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>

                    {/* 액션 버튼 */}
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() =>
                            router.push(`/create?edit=${survey.id}`)
                          }
                          sx={{ flexGrow: 1 }}
                        >
                          편집
                        </Button>
                        {survey.responses > 0 && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Analytics />}
                            onClick={() =>
                              router.push(`/survey/${survey.id}/results`)
                            }
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
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => router.push('/create')}
      >
        <Add />
      </Fab>

      {/* 메뉴 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 2 }} />
          편집
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <Share sx={{ mr: 2 }} />
          공유
        </MenuItem>
        {selectedSurvey?.responses && selectedSurvey.responses > 0 && (
          <MenuItem onClick={handleViewResults}>
            <Analytics sx={{ mr: 2 }} />
            결과 보기
          </MenuItem>
        )}
        <MenuItem onClick={handleToggleStatus}>
          {selectedSurvey?.status === 'active' ? (
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
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
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
      </Dialog>

      {/* 공유 다이얼로그 */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>설문 공유</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            아래 링크를 복사하여 설문을 공유하세요
          </Typography>
          <TextField
            fullWidth
            value={
              selectedSurvey
                ? `${window.location.origin}/survey/${selectedSurvey.id}`
                : ''
            }
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
      </Dialog>

      {/* 스낵바 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
}
