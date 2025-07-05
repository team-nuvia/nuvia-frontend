import UserDescription from '@components/molecular/UserDescription';
import { Stack } from '@mui/material';

interface UserCardProps {
  name: string;
  plan: string;
}
const UserCard: React.FC<UserCardProps> = ({ name, plan }) => {
  return (
    <Stack>
      <UserDescription name={name} plan={plan} />
    </Stack>
  );
};

export default UserCard;
