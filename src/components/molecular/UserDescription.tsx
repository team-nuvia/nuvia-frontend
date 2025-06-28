import CommonText from '@components/atom/CommonText';
import { Avatar, Stack } from '@mui/material';

interface UserDescriptionProps {
  name: string;
  plan: string;
}
const UserDescription: React.FC<UserDescriptionProps> = ({ name, plan }) => {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <Avatar
        src="https://github.com/shadcn.png"
        sx={{ width: 45, height: 45 }}
      />
      <Stack direction="column" justifyContent="center" gap={0.5}>
        <CommonText variant="overline" lineHeight={1}>
          {name}
        </CommonText>
        <CommonText color="text.secondary" variant="caption" lineHeight={1}>
          {plan}
        </CommonText>
      </Stack>
    </Stack>
  );
};

export default UserDescription;
