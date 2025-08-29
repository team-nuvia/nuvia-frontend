import { Typography, TypographyProps } from '@mui/material';
import styled from 'styled-components';

const CommonText = styled(Typography).attrs<
  TypographyProps & { component?: React.ElementType | HTMLElement }
>(({ variant = 'body1' }) => ({ variant }))``;

export default CommonText;
