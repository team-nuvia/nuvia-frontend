import { useEventBus } from '@/store/event-bus.store';
import { AppEventType } from '@/store/lib/app-event';
import queryKeys from '@/store/lib/query-key';
import { getSurveyBinList } from '@api/survey/get-survey-bin-list';
import { restoreAllSurvey } from '@api/survey/restore-all-survey';
import { restoreSurvey } from '@api/survey/restore-survey';
import ActionButton from '@components/atom/ActionButton';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import { Delete, Restore } from '@mui/icons-material';
import { IconButton, List, ListItem, ListItemText, Stack, Tooltip, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DateFormat } from '@util/dateFormat';
import { LocalizationManager } from '@util/LocalizationManager';
import { AxiosError } from 'axios';
import { useContext } from 'react';

export default function SurveyBinDialog() {
  const publish = useEventBus((s) => s.publish);
  const { handleOpenDialog } = useContext(GlobalDialogContext);
  const { addNotice } = useContext(GlobalSnackbarContext);
  const { data: binList } = useQuery({
    queryKey: queryKeys.survey.binList(),
    queryFn: () => getSurveyBinList({ page: 1, limit: 10, search: '' }),
  });
  const { mutate: restoreSurveyMutate } = useMutation({
    mutationFn: ({ surveyId }: { surveyId: string }) => restoreSurvey(surveyId),
    onSuccess: () => {
      addNotice('설문이 복원되었습니다', 'success');
      publish({ type: AppEventType.SURVEY_BIN_RESTORED });
    },
    onError: (error: AxiosError<ServerResponse<null>>) => {
      addNotice((error.response?.data?.reason as string) || error.response?.data?.message || '설문 복원에 실패했습니다', 'error');
    },
  });
  const { mutate: restoreAllSurveyMutate } = useMutation({
    mutationFn: () => restoreAllSurvey(),
    onSuccess: (data) => {
      addNotice(data?.message || '모든 설문이 복원되었습니다', 'success');
      publish({ type: AppEventType.SURVEY_BIN_RESTORED });
    },
    onError: (error: AxiosError<ServerResponse<null>>) => {
      addNotice(
        error.response?.data?.message
          ? `${error.response?.data?.message}${error.response?.data?.reason ? ` (${error.response?.data?.reason}개)` : ''}`
          : '모든 설문 복원에 실패했습니다',
        'error',
      );
    },
  });

  const handleRestoreAll = () => {
    handleOpenDialog({
      title: '전체 복원',
      content: '전체 설문을 복원하시겠습니까?',
      actionCallback: () => {
        restoreAllSurveyMutate();
      },
      type: 'error',
    });
  };

  const handleRestore = (id: number) => {
    handleOpenDialog({
      title: '설문 복원',
      content: '설문을 복원하시겠습니까?',
      actionCallback: () => {
        restoreSurveyMutate({ surveyId: id.toString() });
      },
      type: 'error',
    });
  };

  return (
    <Stack gap={3}>
      <Stack direction="row" justifyContent="right" alignItems="center">
        <ActionButton startIcon={<Delete />} variant="contained" color="error" onClick={handleRestoreAll}>
          전체 복원
        </ActionButton>
      </Stack>
      <List>
        {binList?.payload?.data.length === 0 && <Typography>복원할 설문이 없습니다.</Typography>}
        {binList?.payload?.data.map((item) => (
          <ListItem
            key={item.id}
            sx={{ p: 0 }}
            secondaryAction={
              <Tooltip title="복원">
                <IconButton onClick={() => handleRestore(item.id)}>
                  <Restore />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemText
              primary={`${item.title} (${LocalizationManager.translate(item.status)})`}
              secondary={`삭제일: ${DateFormat.toKST('YYYY-MM-dd', item.deletedAt)}`}
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
