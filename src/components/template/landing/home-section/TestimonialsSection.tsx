import CommonText from '@components/atom/CommonText';
import Showbox from '@components/atom/Showbox';
import { BaseSection } from '@components/organism/BaseSection';
import ReviewCard from '@components/organism/ReviewCard';
import { Box, Grid, Stack, useTheme } from '@mui/material';

export const TestimonialsSection = () => {
  const theme = useTheme();
  const data = [
    {
      txt: '분석 카드가 자동으로 떠서 공유가 빨라졌어요.',
      who: '스타트업 PM 유정*',
      av: 'Y',
    },
    {
      txt: '비교 분석으로 개선 포인트가 명확해졌습니다.',
      who: '프리랜서 디자이너 김효*',
      av: 'K',
    },
    {
      txt: '비회원 참여가 가능해서 응답률이 확실히 올라갔습니다.',
      who: '마케터 이수*',
      av: 'L',
    },
  ];

  return (
    <Box sx={{ backgroundColor: theme.palette.grey[50], py: { xs: 12, md: 16 }, position: 'relative' }}>
      <BaseSection>
        <Stack spacing={3} alignItems="center" textAlign="center" mb={6}>
          <Showbox>
            <CommonText variant="h3" thickness="bold" gutterBottom>
              사용자들의 후기
            </CommonText>
          </Showbox>
        </Stack>
        <Grid container spacing={3}>
          {data.map((t, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 4 }}>
              <Showbox>
                <ReviewCard {...t} />
              </Showbox>
            </Grid>
          ))}
        </Grid>
      </BaseSection>
    </Box>
  );
};
