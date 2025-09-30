import { Stack, Typography } from '@mui/material';

interface NotFoundSectionProps {}
const NotFoundSection: React.FC<NotFoundSectionProps> = () => {
  return (
    <Stack spacing={2} sx={{ maxWidth: 480 }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          fontSize: { xs: '1.75rem', sm: '2.25rem' },
          mb: 1,
        }}
      >
        404
      </Typography>

      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          mb: 2,
        }}
      >
        찾으시는 페이지가 없어요
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          lineHeight: 1.7,
          fontSize: '1rem',
          fontWeight: 400,
        }}
      >
        페이지가 이동되었거나 삭제되었을 수 있습니다.
        <br />
        주소를 다시 확인하거나 아래 버튼으로 이동해 보세요.
      </Typography>
    </Stack>
  );
};

export default NotFoundSection;
