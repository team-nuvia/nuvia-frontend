'use client';

import ActionButton from '@components/atom/ActionButton';
import LimitTextField from '@components/atom/LimitTextField';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import { ArrowBack } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface ReportProps {
  modal?: boolean;
}
const Report: React.FC<ReportProps> = ({ modal = false }) => {
  const router = useRouter();
  const params = useParams();
  const hash = params.hash as string;
  const { handleOpenDialog } = useContext(GlobalDialogContext);
  const [reason, setReason] = useState('');

  const handleChangeReason = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
  };

  const handleSubmit = () => {
    handleOpenDialog({
      type: 'warning',
      title: '신고하기',
      content: '준비중인 기능입니다.',
      useConfirm: false,
    });
  };

  return (
    <Stack gap={3} sx={{ p: { xs: 2, md: 4 } }}>
      <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={1}>
        {!modal ? (
          <ActionButton
            onClick={() => router.push(`/survey/view/${hash}`)}
            onMouseEnter={() => router.prefetch(`/survey/view/${hash}`)}
            startIcon={<ArrowBack />}
          >
            설문으로
          </ActionButton>
        ) : null}
        <Typography variant="h5" fontWeight={700}>
          설문 신고 (준비중인 기능입니다.)
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        설문 내용에 문제가 있다면 구체적인 사유를 작성해 신고해 주세요.
        <br />
        신고는 운영진에 의해 검토된 후 처리됩니다.
      </Typography>
      <form>
        <Stack gap={2}>
          <Typography variant="subtitle1" fontWeight={600}>
            신고 사유
          </Typography>
          <LimitTextField
            disabled
            maxLength={1000}
            fullWidth
            multiline
            rows={5}
            placeholder="신고 사유를 구체적으로 입력해 주세요."
            value={reason}
            onChange={handleChangeReason}
            resizeY
          />

          <Stack direction="row" gap={1} justifyContent="flex-end" mt={2}>
            <ActionButton type="submit" size="large" variant="contained" shape="rounded" disabled onClick={handleSubmit}>
              신고하기
            </ActionButton>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default Report;
