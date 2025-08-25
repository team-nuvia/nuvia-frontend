import type { SxProps, Theme } from '@mui/material';

export function getFadeUpStyles(inView: boolean, delay = 0): SxProps<Theme> {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? 'none' : 'translateY(40px)',
    transition: `opacity .8s ${delay}ms ease-out, transform .8s ${delay}ms ease-out`,
  };
}
