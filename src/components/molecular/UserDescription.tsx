import CommonText from '@components/atom/CommonText';
import { Avatar, Stack } from '@mui/material';

interface UserDescriptionProps {
  name: string;
  content: React.ReactNode;
  nameSize?: number;
}
const UserDescription: React.FC<UserDescriptionProps> = ({
  name,
  content,
  nameSize = 16,
}) => {
  return (
    <Stack direction="row" alignItems="center" gap={2} mb={2}>
      <Avatar
        src="https://github.com/shadcn.png"
        sx={{ width: 45, height: 45 }}
      />
      <Stack direction="column" justifyContent="center" gap={0.5}>
        <CommonText lineHeight={1} fontSize={nameSize} thickness="bold">
          {name}
        </CommonText>
        {content}
      </Stack>
    </Stack>
  );
};

export default UserDescription;
