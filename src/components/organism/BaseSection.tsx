import { Container, ContainerProps } from '@mui/material';

export const BaseSection = ({ children, ...props }: { children: React.ReactNode } & ContainerProps) => (
  <Container component="section" {...props}>
    {children}
  </Container>
);
