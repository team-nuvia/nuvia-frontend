'use client';

import { VERSION } from '@common/variables';
import { Typography } from '@mui/material';

interface VersioningProps {}
const Versioning: React.FC<VersioningProps> = () => {
  return (
    <Typography
      textAlign="right"
      fontSize="0.65rem"
      sx={(theme) => ({
        position: 'absolute',
        top: 67,
        left: 8,
        zIndex: 10,
        fontWeight: 700,
        letterSpacing: 1,
        // 텍스트 마스크로 색상 반전 효과
        background:
          theme.palette.mode === 'dark'
            ? theme.palette.getContrastText(theme.palette.background.paper)
            : theme.palette.getContrastText(theme.palette.background.default),
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        // 다크모드에서 약간의 그림자 추가로 가독성 향상
        textShadow: theme.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.4)' : '0 1px 2px rgba(255,255,255,0.2)',
        userSelect: 'none',
        pointerEvents: 'none',
      })}
    >
      V.{VERSION}
    </Typography>
  );
};

export default Versioning;
