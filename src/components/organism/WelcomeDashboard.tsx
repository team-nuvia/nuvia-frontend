import { useAuthStore } from '@/store/auth.store';
import ActionButton from '@components/atom/ActionButton';
import CommonText from '@components/atom/CommonText';
import { Add } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { UserRole } from '@share/enums/user-role';
import { roleAtLeast } from '@util/roleAtLeast';
import { useRouter } from 'next/navigation';

const WelcomeDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  return (
    <Stack gap={2}>
      <CommonText>👋 {user?.name}님, 반가워요!</CommonText>
      <Stack direction="row" gap={1}>
        {roleAtLeast(UserRole.Editor, user?.role) && (
          <ActionButton
            variant="contained"
            shape="rounded"
            color="black"
            size="large"
            startIcon={<Add />}
            onClick={() => {
              router.push('/dashboard/survey/create');
            }}
          >
            새 설문 만들기
          </ActionButton>
        )}
        {roleAtLeast(UserRole.Viewer, user?.role) && (
          <ActionButton
            color="black"
            variant="outlined"
            shape="rounded"
            onClick={() => {
              router.push('/dashboard/survey');
            }}
          >
            내 설문 보기
          </ActionButton>
        )}
      </Stack>
    </Stack>
  );
};

export default WelcomeDashboard;
