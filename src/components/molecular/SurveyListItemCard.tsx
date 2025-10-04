import { useEventBus } from '@/store/event-bus.store';
import { AppEventType } from '@/store/lib/app-event';
import { deleteSurvey } from '@api/survey/delete-survey';
import { toggleSurveyVisibility } from '@api/survey/toggle-survey-visibility';
import { updateSurveyStatus } from '@api/survey/update-survey-status';
import ActionButton from '@components/atom/ActionButton';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import {
  Analytics,
  ChangeCircle,
  ContentCopy,
  Delete,
  Edit,
  MoreVert,
  People,
  Schedule,
  Share,
  TrendingUp,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Grid, IconButton, Menu, MenuItem, TextField, Typography, useTheme } from '@mui/material';
import { SurveyStatus } from '@share/enums/survey-status';
import { SearchSurvey } from '@share/interface/search-survey';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DateFormat } from '@util/dateFormat';
import { getSurveyStatusColor } from '@util/getSurveyStatusColor';
import { LocalizationManager } from '@util/LocalizationManager';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { memo, useContext, useEffect, useState } from 'react';

interface SurveyListItemCardProps {
  survey: SearchSurvey;
}
const SurveyListItemCard: React.FC<SurveyListItemCardProps> = ({ survey }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const theme = useTheme();
  const publish = useEventBus((s) => s.publish);
  const [prefetchEdit, setPrefetchEdit] = useState(false);
  const [prefetchResults, setPrefetchResults] = useState(false);
  const { handleOpenDialog } = useContext(GlobalDialogContext);
  const { addNotice } = useContext(GlobalSnackbarContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subAnchorEl, setSubAnchorEl] = useState<null | HTMLElement>(null);
  const { mutate: mutateToggleVisibility } = useMutation({
    mutationKey: ['toggleVisibility', survey.id],
    mutationFn: toggleSurveyVisibility,
    onSuccess: () => {
      addNotice(`설문이 ${survey.isPublic ? '비활성화' : '활성화'}되었습니다`, 'success');
      publish({ type: AppEventType.SURVEY_TOGGLE_VISIBILITY });
    },
    onError: () => {
      addNotice('설문 활성화에 실패했습니다', 'error');
    },
  });
  const { mutate: mutateDeleteSurvey } = useMutation({
    mutationKey: ['deleteSurvey', survey.id],
    mutationFn: deleteSurvey,
    onSuccess: () => {
      addNotice('설문이 삭제되었습니다', 'success');
      publish({ type: AppEventType.SURVEY_DELETED });
    },
    onError: () => {
      addNotice('설문 삭제에 실패했습니다', 'error');
    },
  });
  const { mutate: mutateUpdateStatus } = useMutation({
    mutationKey: ['updateStatus', survey.id],
    mutationFn: ({ status }: { status: SurveyStatus }) => updateSurveyStatus(survey.id, status),
    onSuccess: () => {
      addNotice('설문 상태가 변경되었습니다', 'success');
      publish({ type: AppEventType.SURVEY_UPDATED });
    },
    onError: () => {
      addNotice('설문 상태 변경에 실패했습니다', 'error');
    },
  });

  useEffect(() => {
    if (prefetchEdit) {
      router.prefetch(`/dashboard/survey/create?edit=${survey.id}`);
    }
  }, [prefetchEdit]);

  useEffect(() => {
    if (prefetchResults) {
      router.prefetch(`/dashboard/survey/${survey.id}/analysis`);
    }
  }, [prefetchResults]);

  const getStatusText = (status: SearchSurvey['status']) => {
    return LocalizationManager.translate(status);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRedirectEdit = () => {
    router.push(`/dashboard/survey/create?edit=${survey.id}`);
    handleMenuClose();
  };

  const handleRedirectResults = () => {
    router.push(`/dashboard/survey/${survey.id}/analysis`);
    handleMenuClose();
  };

  const handleDelete = () => {
    handleOpenDialog({
      type: 'error',
      title: '설문 삭제',
      content: '삭제된 설문은 관리자 권한부터 복구 가능합니다. 삭제하시겠습니까?',
      actionCallback: confirmDelete,
      useConfirm: true,
    });
    handleMenuClose();
  };

  const handleShare = () => {
    handleOpenDialog({
      type: 'info',
      title: '설문 공유',
      content: (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            아래 링크를 복사하여 설문을 공유하세요
          </Typography>
          <TextField
            fullWidth
            value={`${window.location.origin}/survey/view/${survey.hashedUniqueKey}`}
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
        </>
      ),
      useConfirm: false,
    });
    handleMenuClose();
  };

  const handleToggleVisibility = () => {
    setAnchorEl(null);
    const newStatus = !survey.isPublic;
    mutateToggleVisibility({ surveyId: survey.id, isPublic: newStatus });
    handleMenuClose();
  };

  const confirmDelete = () => {
    mutateDeleteSurvey({ surveyId: survey.id.toString() });
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/survey/view/${survey.hashedUniqueKey}`;
    navigator.clipboard.writeText(link);
    addNotice('링크가 복사되었습니다', 'success');
  };

  const handleOpenStatusMenu = (event: React.MouseEvent<HTMLElement>) => {
    setSubAnchorEl(event.currentTarget);
  };

  const handleCloseStatusMenu = () => {
    setSubAnchorEl(null);
  };

  return (
    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={survey.id}>
      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
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
                  label={getStatusText(survey.isExpired ? SurveyStatus.Closed : survey.status)}
                  color={getSurveyStatusColor(survey.isExpired ? SurveyStatus.Closed : survey.status) as any}
                  size="small"
                />
                {survey.isPublic ? (
                  <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                ) : (
                  <VisibilityOff sx={{ fontSize: 16, color: 'text.secondary' }} />
                )}
              </Box>
              <IconButton size="small" onClick={handleMenuClick}>
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
              생성일: {DateFormat.toKST('YYYY-MM-dd HH:mm', survey.createdAt)}
            </Typography>
          </CardContent>

          {/* 액션 버튼 */}
          <Box sx={{ p: 2, pt: 0 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <ActionButton
                size="small"
                variant="outlined"
                startIcon={<Edit />}
                onMouseEnter={() => setPrefetchEdit(true)}
                onClick={handleRedirectEdit}
                sx={{ flexGrow: 1 }}
              >
                편집
              </ActionButton>
              {survey.responseAmount > 0 && (
                <ActionButton
                  size="small"
                  variant="contained"
                  startIcon={<Analytics />}
                  onMouseEnter={() => setPrefetchResults(true)}
                  onClick={handleRedirectResults}
                  sx={{ flexGrow: 1 }}
                >
                  결과보기
                </ActionButton>
              )}
            </Box>
          </Box>
        </Card>
      </motion.div>
      {/* 메뉴 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleRedirectEdit}>
          <Edit sx={{ mr: 2 }} />
          편집
        </MenuItem>
        {survey.status === SurveyStatus.Active && survey.isPublic && (
          <MenuItem onClick={handleShare}>
            <Share sx={{ mr: 2 }} />
            공유
          </MenuItem>
        )}
        {survey.responseAmount > 0 && (
          <MenuItem onClick={handleRedirectResults}>
            <Analytics sx={{ mr: 2 }} />
            결과 보기
          </MenuItem>
        )}
        <MenuItem
          onClick={handleOpenStatusMenu}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChangeCircle sx={{ mr: 2 }} />
            상태 변경
          </Box>
        </MenuItem>
        <Menu
          anchorEl={subAnchorEl}
          open={Boolean(subAnchorEl)}
          onClose={handleCloseStatusMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            '& .MuiPaper-root': {
              mr: 0.5,
            },
          }}
        >
          <MenuItem selected={survey.status === SurveyStatus.Draft} onClick={() => mutateUpdateStatus({ status: SurveyStatus.Draft })}>
            <Edit sx={{ mr: 2 }} />
            {LocalizationManager.translate(SurveyStatus.Draft)}
          </MenuItem>
          <MenuItem selected={survey.status === SurveyStatus.Active} onClick={() => mutateUpdateStatus({ status: SurveyStatus.Active })}>
            <TrendingUp sx={{ mr: 2 }} />
            {LocalizationManager.translate(SurveyStatus.Active)}
          </MenuItem>
          <MenuItem selected={survey.status === SurveyStatus.Closed} onClick={() => mutateUpdateStatus({ status: SurveyStatus.Closed })}>
            <Schedule sx={{ mr: 2 }} />
            {LocalizationManager.translate(SurveyStatus.Closed)}
          </MenuItem>
        </Menu>
        <MenuItem onClick={handleToggleVisibility}>
          {survey.isPublic ? (
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
    </Grid>
  );
};

// export default SurveyListItemCard;
export default memo(SurveyListItemCard);
