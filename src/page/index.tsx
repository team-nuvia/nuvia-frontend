'use client';

import { useUser } from '@hooks/useUsers';
import { Stack, Typography } from '@mui/material';

interface IndexProps {}
const Index: React.FC<IndexProps> = () => {
  const { data: user, isError } = useUser();
  return (
    <Stack>
      <Typography>SnapPoll</Typography>
      <CommonButton>Button</CommonButton>
    </Stack>
  );
};

export default Index;
