'use client';

import ActionButton from '@components/atom/ActionButton';
import CommonText from '@components/atom/CommonText';
import { Stack, TextField } from '@mui/material';

interface LoginProps {}
const Login: React.FC<LoginProps> = () => {
  return (
    <Stack flex={1} gap={10} p={5} alignItems="center" justifyContent="center">
      <Stack
        p={5}
        component="form"
        gap={2}
        sx={{
          borderWidth: 1,
          borderColor: 'divider',
          borderStyle: 'solid',
          borderRadius: 4,
        }}
      >
        <CommonText variant="h5" gutterBottom>
          Login
        </CommonText>

        <Stack gap={2}>
          <TextField size="small" label="Email" fullWidth />
          <TextField size="small" label="Password" fullWidth />
          <ActionButton variant="contained" fullWidth onClick={() => {}}>
            Login
          </ActionButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Login;
