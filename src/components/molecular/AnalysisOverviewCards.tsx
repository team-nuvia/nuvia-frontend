'use client';

import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';

export function AnalysisOverviewCards({ data, loading }: { data?: OverviewPayload; loading?: boolean }) {
  if (loading) return <SkeletonCards />;

  const s = data?.stats;
  const pct = (n?: number | null) => (n == null ? '—' : `${Math.round(n * 100)}%`);
  const num = (n?: number) => (typeof n === 'number' ? n.toLocaleString() : '—');

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      <StatCard title="총 응답 수" value={num(s?.totalResponses)} />
      <StatCard title="설문당 평균 응답 수" value={num(s?.avgResponsesPerSurvey)} />
      <StatCard title="최근 30일 응답 증가율" value={`${(s?.growth30dPct ?? 0).toFixed(1)}%`} />
      <StatCard title="완료율" value={pct(s?.completionRate)} />
    </Stack>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card sx={{ flex: 1, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={800} mt={0.5}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function SkeletonCards() {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      {[0, 1, 2, 3].map((k) => (
        <Card key={k} sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent>
            <Skeleton width="40%" />
            <Skeleton width="60%" height={36} />
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
