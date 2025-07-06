import UserDescription from '@components/molecular/UserDescription';
import { Stack } from '@mui/material';

interface UserCardProps {
  name: string;
  plan: string;
  nameSize?: number;
}
const UserCard: React.FC<UserCardProps> = ({ name, plan, nameSize }) => {
  return (
    <Stack>
      <UserDescription name={name} content={plan} nameSize={nameSize} />
    </Stack>
  );
};

export default UserCard;
