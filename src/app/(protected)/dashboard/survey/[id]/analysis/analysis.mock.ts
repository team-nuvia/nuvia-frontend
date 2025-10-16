// export const mockAnalysis: AnalysisPageData = {
//   overview: {
//     surveyId: 'svy_demo_01',
//     title: 'Nuvia 데모 설문',
//     periodLabel: '최근 30일',
//     stats: { totalResponses: 1204, avgResponsesPerSurvey: 301, growth30dPct: 18.6, completionRate: 0.72 },
//     dailyTrend: [
//       { date: '2025-01-01', count: 12 },
//       { date: '2025-01-02', count: 15 },
//       { date: '2025-01-03', count: 21 },
//     ],
//   },
//   questions: [
//     {
//       questionId: 'q1',
//       questionTitle: '우리 서비스를 어떻게 알게 되셨나요?',
//       questionType: 'single',
//       totalAnswers: 1180,
//       distribution: {
//         type: 'single',
//         buckets: [
//           { value: '검색엔진', count: 420 },
//           { value: 'SNS', count: 360 },
//           { value: '지인추천', count: 280 },
//           { value: '기타', count: 120 },
//         ],
//       },
//     },
//     {
//       questionId: 'q2',
//       questionTitle: '주로 사용하는 기능(복수 선택)',
//       questionType: 'multiple',
//       totalAnswers: 1103,
//       distribution: {
//         type: 'multiple',
//         buckets: [
//           { value: '대시보드', count: 640 },
//           { value: '설문공유', count: 720 },
//           { value: '결과내보내기', count: 240 },
//           { value: '이미지응답', count: 190 },
//         ],
//       },
//       note: '다중선택: 총합이 응답 수보다 클 수 있습니다.',
//     },
//     {
//       questionId: 'q3',
//       questionTitle: '월 평균 사용 시간(분)',
//       questionType: 'number',
//       totalAnswers: 980,
//       distribution: {
//         type: 'number',
//         bins: [
//           { x0: 0, x1: 10, count: 120 },
//           { x0: 10, x1: 20, count: 240 },
//           { x0: 20, x1: 30, count: 320 },
//           { x0: 30, x1: 60, count: 220 },
//           { x0: 60, x1: 120, count: 80 },
//         ],
//       },
//     },
//     {
//       questionId: 'q4',
//       questionTitle: '처음 사용한 날짜',
//       questionType: 'date',
//       totalAnswers: 1150,
//       distribution: {
//         type: 'date',
//         buckets: [
//           { date: '2025-01-01', count: 20 },
//           { date: '2025-01-02', count: 42 },
//           { date: '2025-01-03', count: 38 },
//         ],
//       },
//     },
//     {
//       questionId: 'q5',
//       questionTitle: '개선되었으면 하는 점',
//       questionType: 'text',
//       totalAnswers: 340,
//       distribution: {
//         type: 'text',
//         samples: [
//           { snippet: '다크모드 대비가 약해요', count: 12 },
//           { snippet: 'CSV 내보내기 시간이 길어요', count: 9 },
//           { snippet: '모바일 작성 화면을 단순하게', count: 7 },
//         ],
//       },
//       note: '텍스트 응답은 상위 샘플만 노출(MVP)',
//     },
//   ],
// };
