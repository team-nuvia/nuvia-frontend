'use client';

import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function AnalysisQuestionCard({ data }: { data: QuestionDistribution }) {
  const { questionTitle, distribution, totalAnswers, note } = data;

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader title={questionTitle} subheader={`응답 수: ${totalAnswers.toLocaleString()}`} sx={{ pb: 0.5 }} />
      <CardContent sx={{ pt: 1.5 }}>
        {renderChart(distribution)}
        {note && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="caption" color="text.secondary">
              {note}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function renderChart(d: Distribution) {
  switch (d.type) {
    case DataType.Rating:
    case QuestionType.SingleChoice:
    case QuestionType.MultipleChoice: {
      const rows = d.buckets.map((b) => ({ name: b.value, count: b.count }));
      return (
        <ChartBox>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 8, right: 16, left: -16, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3D5AFE" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      );
    }
    case DataType.Time: {
      const rows = d.bins.map((b) => ({ name: `${b.x0}–${b.x1}`, count: b.count }));
      return (
        <ChartBox>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 8, right: 16, left: -16, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3D5AFE" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      );
    }
    // case 'number': {
    //   const rows = d.bins.map((b) => ({ name: `${b.x0}–${b.x1}`, count: b.count }));
    //   return (
    //     <ChartBox>
    //       <ResponsiveContainer width="100%" height="100%">
    //         <BarChart data={rows} margin={{ top: 8, right: 16, left: -16, bottom: 8 }}>
    //           <CartesianGrid strokeDasharray="3 3" />
    //           <XAxis dataKey="name" tick={{ fontSize: 12 }} />
    //           <YAxis />
    //           <Tooltip />
    //           <Bar dataKey="count" />
    //         </BarChart>
    //       </ResponsiveContainer>
    //     </ChartBox>
    //   );
    // }
    // case DataType.Date: {
    //   const rows = d.buckets.map((b) => ({ date: b.date, count: b.count }));
    //   return (
    //     <ChartBox>
    //       <ResponsiveContainer width="100%" height="100%">
    //         <LineChart data={rows} margin={{ top: 8, right: 16, left: -8, bottom: 8 }}>
    //           <CartesianGrid strokeDasharray="3 3" />
    //           <XAxis dataKey="date" tick={{ fontSize: 12 }} />
    //           <YAxis />
    //           <Tooltip />
    //           <Line type="monotone" dataKey="count" />
    //         </LineChart>
    //       </ResponsiveContainer>
    //     </ChartBox>
    //   );
    // }
    case DataType.Date:
    case QuestionType.ShortText:
    case QuestionType.LongText: {
      // MVP: 상위 샘플 나열
      return (
        <Typography variant="body2" component="div" sx={{ display: 'grid', gap: 0.75 }}>
          {d.samples.slice(0, 10).map((s, i) => (
            <div key={i}>
              • {s.snippet}
              {s.count ? ` (x${s.count})` : ''}
            </div>
          ))}
        </Typography>
      );
    }
    default:
      return <Typography color="text.secondary">지원하지 않는 질문 타입</Typography>;
  }
}

function ChartBox({ children }: { children: React.ReactNode }) {
  return <div style={{ width: '100%', height: 280 }}>{children}</div>;
}
