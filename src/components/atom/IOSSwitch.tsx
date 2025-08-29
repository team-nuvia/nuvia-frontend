import { styled, Switch, SwitchProps } from '@mui/material';

const IOSSwitch = styled((props: SwitchProps) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />, {
  shouldForwardProp(propName) {
    return propName !== 'size';
  },
})(({ theme, size }) => {
  const switchSize = (() => {
    switch (size) {
      case 'small':
        return {
          width: -8,
          height: -8,
        };
      case 'medium':
        return {
          width: 0,
          height: 0,
        };
      default:
        return {
          width: 0,
          height: 0,
        };
    }
  })();

  return {
    width: 42 + switchSize.width,
    height: 26 + switchSize.height,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: '#65C466',
          opacity: 1,
          border: 0,
          ...theme.applyStyles('dark', {
            backgroundColor: '#2ECA45',
          }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.grey[100],
        ...theme.applyStyles('dark', {
          color: theme.palette.grey[600],
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.7,
        ...theme.applyStyles('dark', {
          opacity: 0.3,
        }),
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22 + switchSize.width,
      height: 22 + switchSize.height,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: '#E9E9EA',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
      ...theme.applyStyles('dark', {
        backgroundColor: '#39393D',
      }),
    },
  };
});

export default IOSSwitch;
