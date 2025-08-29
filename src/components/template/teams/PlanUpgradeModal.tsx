'use client';

import { NoticeServiceUpgrade } from '@components/molecular/NoticeServiceUpgrade';
import { Box, Stack, Typography } from '@mui/material';

const PlanUpgradeModal = () => {
  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Stack spacing={3} alignItems="center" textAlign="center">
        {/* 아이콘 영역 */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <Typography sx={{ fontSize: 40 }}>🚀</Typography>
        </Box>

        {/* 제목 */}
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          팀 기능 업그레이드 필요
        </Typography>

        {/* 설명 */}
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          팀 초대 및 협업 기능은 조직 플랜에서만 이용할 수 있습니다.
          <br />더 강력한 협업 도구로 팀의 생산성을 높여보세요.
        </Typography>

        {/* 플랜별 혜택 비교 */}
        <Stack spacing={2} sx={{ width: '100%', mt: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            플랜별 팀원 초대 한도
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            {/* Basic Plan */}
            <Box
              sx={{
                p: 2,
                border: '2px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                minWidth: 120,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                Basic
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                10명
              </Typography>
              <Typography variant="caption" color="text.secondary">
                팀원 초대
              </Typography>
            </Box>

            {/* Premium Plan */}
            <Box
              sx={{
                p: 2,
                border: '2px solid',
                borderColor: 'primary.main',
                borderRadius: 2,
                minWidth: 120,
                bgcolor: 'primary.50',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: 'primary.main',
                  color: 'white.main',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                추천
              </Box>
              <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                Premium
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                30명
              </Typography>
              <Typography variant="caption" color="text.secondary">
                팀원 초대
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* 혜택 리스트 */}
        <Stack spacing={1.5} sx={{ width: '100%', mt: 2 }}>
          {[
            '팀원 초대 및 관리',
            '고급 권한 관리 (Admin, Editor, Viewer)',
            '팀 설문 공유 및 협업',
            '실시간 응답 현황 모니터링',
            '팀별 데이터 분석 및 리포트',
          ].map((benefit, index) => (
            <Stack key={index} direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{ color: 'success.main', fontSize: 18 }}>✓</Box>
              <Typography variant="body2" color="text.secondary">
                {benefit}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* 업그레이드 안내 */}
        <NoticeServiceUpgrade />
      </Stack>
    </Box>
  );
};

export default PlanUpgradeModal;
