'use client';

import { useTheme } from '@context/ThemeContext';
import { IconButton, Tooltip } from '@mui/material';
import { 
  LightMode as LightModeIcon, 
  DarkMode as DarkModeIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'medium', 
  showTooltip = true 
}) => {
  const { mode, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <DarkModeIcon />;
      case 'dark':
        return <LightModeIcon />;
      case 'system':
        return <SettingsIcon />;
      default:
        return <SettingsIcon />;
    }
  };

  const getTooltipText = () => {
    switch (mode) {
      case 'light':
        return '다크 모드로 변경';
      case 'dark':
        return '라이트 모드로 변경';
      case 'system':
        return '테마 토글 (현재: 시스템 설정)';
      default:
        return '테마 토글';
    }
  };

  const button = (
    <IconButton 
      onClick={toggleTheme} 
      size={size}
      color="inherit"
      aria-label="테마 변경"
    >
      {getIcon()}
    </IconButton>
  );

  if (showTooltip) {
    return (
      <Tooltip title={getTooltipText()}>
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default ThemeToggle;
