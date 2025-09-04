'use client';

import { mockAnalysis } from '@/app/(site)/(dashboard)/survey/[id]/analysis/analysis.mock';
import { AnalysisOverviewCards } from '@components/molecular/AnalysisOverviewCards';
import { AnalysisQuestionCard } from '@components/molecular/AnalysisQuestionCard';
import LoadingContext from '@context/LoadingContext';
import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';

export default function Analysis({ params }: { params: { surveyId: string } }) {
  const { surveyId } = params;
  const [data, setData] = useState<AnalysisPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const { endLoading } = useContext(LoadingContext);

  // TODO: 실제 API 연결 + 로딩 처리 hook으로 대체
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // const res = await fetch(`/api/analytics/surveys/${params.surveyId}`);
        // const json = await res.json();
        const json = mockAnalysis; // 데모
        if (mounted) setData(json);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    console.log('로딩 끝');
    endLoading();
    return () => {
      mounted = false;
    };
  }, [params.surveyId]);

  const title = useMemo(() => data?.overview.title ?? '분석', [data]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="baseline" justifyContent="space-between">
          <Typography variant="h4" fontWeight={800}>
            {title}
          </Typography>
          {/* 향후: 설문 선택/기간 필터/내보내기 자리 */}
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
