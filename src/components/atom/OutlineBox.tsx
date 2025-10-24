import { Box, BoxProps } from '@mui/material';

interface OutlineBoxProps {}
const OutlineBox: React.FC<OutlineBoxProps & BoxProps> = ({ children, sx, ...props }) => {
  return (
    <Box
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
    </Box>
  );
};

export default OutlineBox;
