import { useTheme } from '@mui/material/styles';

interface ErrorBackgroundProps {}
const ErrorBackground: React.FC<ErrorBackgroundProps> = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  // 다크모드에 따른 색상 설정
  const bgColor = isDark ? '#0a0a0a' : '#fafafa';
  const primaryColor = isDark ? '#667eea' : '#667eea';
  const secondaryColor = isDark ? '#764ba2' : '#764ba2';
  const accentColor = isDark ? '#f093fb' : '#f093fb';
  const centerColor = isDark ? '#1a1a1a' : 'white';
  
  // 다크모드에 따른 투명도 조정
  const opacityMultiplier = isDark ? 1.5 : 1;

  return (
    <svg 
      // viewBox="0 0 1920 1080" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: primaryColor, stopOpacity: 0.05 * opacityMultiplier }} />
          <stop offset="50%" style={{ stopColor: secondaryColor, stopOpacity: 0.03 * opacityMultiplier }} />
          <stop offset="100%" style={{ stopColor: accentColor, stopOpacity: 0.05 * opacityMultiplier }} />
        </linearGradient>

        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: primaryColor, stopOpacity: 0.1 * opacityMultiplier }} />
          <stop offset="100%" style={{ stopColor: secondaryColor, stopOpacity: 0.15 * opacityMultiplier }} />
        </linearGradient>
      </defs>

      <rect width="1920" height="1080" fill={bgColor} />
      <rect width="1920" height="1080" fill="url(#bgGradient)" />

      <circle cx="200" cy="150" r="120" fill="url(#circleGradient)" />
      <circle cx="1750" cy="900" r="150" fill="url(#circleGradient)" />
      <circle cx="1600" cy="200" r="100" fill="url(#circleGradient)" />
      <circle cx="300" cy="850" r="80" fill="url(#circleGradient)" />

      <circle cx="500" cy="300" r="40" fill={primaryColor} opacity={0.08 * opacityMultiplier} />
      <circle cx="1400" cy="600" r="50" fill={secondaryColor} opacity={0.08 * opacityMultiplier} />
      <circle cx="800" cy="150" r="30" fill={accentColor} opacity={0.08 * opacityMultiplier} />
      <circle cx="1200" cy="850" r="35" fill={primaryColor} opacity={0.08 * opacityMultiplier} />

      <line x1="300" y1="200" x2="600" y2="400" stroke={primaryColor} strokeWidth="2" opacity={0.1 * opacityMultiplier} />
      <line x1="1400" y1="300" x2="1600" y2="500" stroke={secondaryColor} strokeWidth="2" opacity={0.1 * opacityMultiplier} />
      <line x1="700" y1="700" x2="1000" y2="900" stroke={accentColor} strokeWidth="2" opacity={0.1 * opacityMultiplier} />

      <rect x="100" y="500" width="80" height="80" fill="none" stroke={primaryColor} strokeWidth="2" opacity={0.1 * opacityMultiplier} transform="rotate(15 140 540)" />
      <rect x="1500" y="400" width="100" height="100" fill="none" stroke={secondaryColor} strokeWidth="2" opacity={0.1 * opacityMultiplier} transform="rotate(-20 1550 450)" />
      <rect x="900" y="250" width="60" height="60" fill="none" stroke={accentColor} strokeWidth="2" opacity={0.1 * opacityMultiplier} transform="rotate(30 930 280)" />

      <circle cx="450" cy="550" r="8" fill={primaryColor} opacity={0.15 * opacityMultiplier} />
      <circle cx="1300" cy="450" r="6" fill={secondaryColor} opacity={0.15 * opacityMultiplier} />
      <circle cx="750" cy="800" r="7" fill={accentColor} opacity={0.15 * opacityMultiplier} />
      <circle cx="1100" cy="300" r="5" fill={primaryColor} opacity={0.15 * opacityMultiplier} />
      <circle cx="600" cy="700" r="6" fill={secondaryColor} opacity={0.15 * opacityMultiplier} />
      <circle cx="1450" cy="750" r="8" fill={accentColor} opacity={0.15 * opacityMultiplier} />

      <circle cx="960" cy="540" r="250" fill={centerColor} opacity={isDark ? 0.1 : 0.3} />
      <circle cx="960" cy="540" r="220" fill={centerColor} opacity={isDark ? 0.05 : 0.2} />
    </svg>
  );
};

export default ErrorBackground;
