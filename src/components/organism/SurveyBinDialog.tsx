import { getSurveyBinList } from '@api/get-survey-bin-list';
import { restoreSurvey } from '@api/restore-survey';
import { SURVEY_STATUS_LABELS } from '@common/variables';
import ActionButton from '@components/atom/ActionButton';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import { Delete, Restore } from '@mui/icons-material';
import { IconButton, List, ListItem, ListItemText, Stack, Tooltip, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DateFormat } from '@util/dateFormat';
import { useContext } from 'react';

export default function SurveyBinDialog({ refetchSurveyList }: { refetchSurveyList: () => void }) {
  const { addNotice } = useContext(GlobalSnackbarContext);
  const { data: binList, refetch: refetchBinList } = useQuery({
    queryKey: ['surveyBinList'],
    queryFn: () => getSurveyBinList({ page: 1, limit: 10, search: '' }),
  });
  const { mutate: restoreSurveyMutate } = useMutation({
    mutationFn: ({ surveyId }: { surveyId: string }) => restoreSurvey(surveyId),
    onSuccess: () => {
      addNotice('설문이 복원되었습니다', 'success');
      refetchSurveyList();
      refetchBinList();
    },
    onError: () => {
      addNotice('설문 복원에 실패했습니다', 'error');
    },
  });

  const handleRestoreAll = () => {
    console.log('전체 복원');
  };

  const handleRestore = (id: number) => {
    console.log('복원', id);
    restoreSurveyMutate({ surveyId: id.toString() });
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
              primary={`${item.title} (${SURVEY_STATUS_LABELS[item.status]})`}
              secondary={`삭제일: ${DateFormat.toKST('YYYY-MM-dd', item.deletedAt)}`}
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
