import { Button, ButtonProps } from '@mui/material';
import styled from 'styled-components';

const CommonButton = styled(Button).attrs<ButtonProps>((props) => ({
  ...props,
}))`
  transition: all 150ms ease-in-out !important;
  &:hover {
    opacity: 0.8;
    box-shadow: inset 0 0 0 99999px #56565656;
  }
`;

export default CommonButton;
