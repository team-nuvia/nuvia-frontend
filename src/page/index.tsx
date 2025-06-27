'use client';

import { useUser } from '@hooks/useUsers';
import { Stack, Typography } from '@mui/material';

interface IndexProps {}
const Index: React.FC<IndexProps> = () => {
  const { data: user, isError } = useUser();
  console.log(user, isError);
  return (
    <Stack>
      <Typography>SnapPoll</Typography>
    </Stack>
  );
};

export default Index;
