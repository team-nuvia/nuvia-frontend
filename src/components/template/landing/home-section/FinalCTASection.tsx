import CommonText from '@components/atom/CommonText';
import CTAButton from '@components/atom/CTAButton';
import { BaseSection } from '@components/organism/BaseSection';
import { Box, Container, Stack, useTheme } from '@mui/material';

export const FinalCTASection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        py: { xs: 16, md: 20 },
        px: { xs: 3, md: 4 },
        background: isDark
          ? `linear-gradient(135deg, ${theme.palette.primary.dark}CC 0%, #0B0F1A 100%)`
          : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? `radial-gradient(circle at 30% 20%, ${theme.palette.primary.light}14 0%, transparent 55%),
                radial-gradient(circle at 70% 80%, ${theme.palette.primary.dark}26 0%, transparent 55%)`
            : `radial-gradient(circle at 30% 20%, ${theme.palette.primary.light}20 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, ${theme.palette.primary.dark}15 0%, transparent 50%)`,
          pointerEvents: 'none',
        },
        // 다크 모드 가독성 향상을 위한 미묘한 어두운 오버레이
        '&::after': isDark
          ? {
              content: '""',
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(1200px 600px at 50% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.12) 65%, transparent 80%)',
              pointerEvents: 'none',
            }
          : undefined,
      }}
    >
      <BaseSection>
        <Container maxWidth="md">
          <Stack spacing={6} alignItems="center" textAlign="center" position="relative" zIndex={1}>
            {/* 메인 헤드라인 */}
            <CommonText
              color="black"
              variant="h3"
              thickness="bold"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                mb: 2,
                color: isDark ? theme.palette.black.main : theme.palette.white.main,
                // textShadow: isDark ? '0 2px 18px rgba(0,0,0,0.6), 0 1px 0 rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.18)',
              }}
            >
              설문조사, 이제 더 간단하게
            </CommonText>

            {/* 서브 텍스트 */}
            <CommonText
              color="black"
              variant="body1"
              sx={{
                opacity: isDark ? 0.98 : 0.95,
                maxWidth: 520,
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                lineHeight: 1.6,
                fontWeight: 400,
                color: isDark ? theme.palette.black.main : theme.palette.white.main,
                // textShadow: isDark ? '0 1px 12px rgba(0,0,0,0.5)' : '0 1px 8px rgba(0,0,0,0.10)',
              }}
            >
              복잡한 설정 없이 몇 분 만에 전문적인 설문을 만들고, 실시간으로 응답을 확인하세요.
            </CommonText>

            {/* CTA 버튼 */}
            <CTAButton invert label="지금 시작하기" />

            {/* 추가 정보 */}
            <CommonText
              color="black"
              variant="caption"
              sx={{
                opacity: isDark ? 0.9 : 0.8,
                fontSize: '0.875rem',
                mt: 2,
                color: isDark ? theme.palette.black.main : theme.palette.white.main,
                // textShadow: isDark ? '0 1px 10px rgba(0,0,0,0.45)' : undefined,
              }}
            >
              무료로 시작 • 신용카드 불필요 • 언제든 취소 가능
            </CommonText>
          </Stack>
        </Container>
      </BaseSection>
    </Box>
  );
};
