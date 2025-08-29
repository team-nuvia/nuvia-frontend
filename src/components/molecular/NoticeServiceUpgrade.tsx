import { Box, Typography } from '@mui/material';

export const NoticeServiceUpgrade = () => {
  return (
    <Box
      sx={{
        mt: 3,
        p: 2.5,
        bgcolor: 'grey.50',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        width: '100%',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        💡 <strong>업그레이드 준비 중</strong>
        <br />
        현재 결제 시스템을 준비하고 있습니다.
        <br />곧 더 나은 팀 협업 경험을 제공할 예정입니다.
      </Typography>
    </Box>
  );
};
