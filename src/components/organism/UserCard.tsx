import UserDescription from '@components/molecular/UserDescription';
import { Stack } from '@mui/material';

interface UserCardProps {}
const UserCard: React.FC<UserCardProps> = () => {
  return (
    <Stack>
      <UserDescription name="John Doe" plan="Pro" />
    </Stack>
  );
};

export default UserCard;
