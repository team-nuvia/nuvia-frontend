'use client';

import { useAuthStore } from '@/store/auth.store';
import queryKeys from '@/store/lib/query-key';
import { getBasicAnalyses } from '@api/analyses/get-basic-analyses';
import ActionButton from '@components/atom/ActionButton';
import { AnalysisOverviewCards } from '@components/molecular/AnalysisOverviewCards';
import { AnalysisQuestionCard } from '@components/molecular/AnalysisQuestionCard';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import { Download, FileDownload, PictureAsPdf } from '@mui/icons-material';
import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useMemo, useState } from 'react';

export default function Analysis({ params }: { params: { surveyId: string } }) {
  const { surveyId } = params;
  const [data, setData] = useState<AnalysisPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleOpenDialog } = useContext(GlobalDialogContext);
  const user = useAuthStore((state) => state.user)!;
  const { data: basicAnalyses, isLoading: isLoadingBasicAnalyses } = useQuery({
    queryKey: queryKeys.analyses.basic(surveyId),
    queryFn: () => getBasicAnalyses(surveyId),
    enabled: !!surveyId,
  });

  // TODO: 실제 API 연결 + 로딩 처리 hook으로 대체
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // const res = await fetch(`/api/analytics/surveys/${params.surveyId}`);
        // const json = await res.json();
        const json = basicAnalyses?.payload; // 데모
        if (mounted && json) setData(json);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params.surveyId, isLoadingBasicAnalyses, user]);

  const title = useMemo(() => data?.overview.title ?? '분석', [data]);

  const handleExcelDownload = () => {
    handleOpenDialog({
      type: 'info',
      title: 'EXCEL 내보내기',
      content: 'EXCEL 내보내기 기능은 준비 중입니다.',
      useConfirm: false,
    });
  };

  const handlePdfDownload = () => {
    handleOpenDialog({
      type: 'info',
      title: 'PDF 내보내기',
      content: 'PDF 내보내기 기능은 준비 중입니다.',
      useConfirm: false,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="baseline" justifyContent="space-between">
          <Typography variant="h4" fontWeight={800}>
            {title}
          </Typography>
          {(data?.permission.download.excel || data?.permission.download.pdf) && (
            <Stack direction="row" gap={1}>
              {/* 향후: 설문 선택/기간 필터/내보내기 자리 */}
              {data?.permission.download.excel && (
                <ActionButton startIcon={<Download />} variant="contained" onClick={() => handleExcelDownload()}>
                  EXCEL 내보내기
                </ActionButton>
              )}
              {data?.permission.download.pdf && (
                <ActionButton startIcon={<PictureAsPdf />} variant="contained" onClick={() => handlePdfDownload()}>
                  PDF 내보내기
                </ActionButton>
              )}
            </Stack>
          )}
        </Stack>

        <AnalysisOverviewCards data={data?.overview} loading={loading} />

        <Divider />

        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            질문별 분포
          </Typography>
          <Stack spacing={2}>
            {(data?.questions ?? []).map((q) => (
              <AnalysisQuestionCard key={q.questionId} data={q} />
            ))}
            {!loading && (!data || data.questions.length === 0) && <Typography color="text.secondary">표시할 질문이 없습니다.</Typography>}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
