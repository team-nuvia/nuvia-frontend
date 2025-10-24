import { Stack, StackProps } from '@mui/material';

interface OutlineStackProps {}
const OutlineStack: React.FC<OutlineStackProps & StackProps> = ({ children, sx, ...props }) => {
  return (
    <Stack
      sx={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
};

export default OutlineStack;
