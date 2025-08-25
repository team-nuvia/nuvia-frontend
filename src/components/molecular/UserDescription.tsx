import CommonText from '@components/atom/CommonText';
import { Avatar, Stack } from '@mui/material';

interface UserDescriptionProps {
  name: string;
  caption?: string;
  content: React.ReactNode;
  nameSize?: number;
  profileImage: string | null;
  isVisible?: boolean;
}
const UserDescription: React.FC<UserDescriptionProps> = ({ name, caption, content, nameSize = 16, profileImage, isVisible = false }) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent={isVisible ? 'flex-start' : 'center'} gap={2} mb={2}>
      <Avatar src={profileImage ?? 'https://github.com/shadcn.png'} sx={{ width: 35, height: 35 }} />
      {isVisible && (
        <Stack direction="column" justifyContent="center" gap={0.5}>
          <CommonText lineHeight={1} fontSize={nameSize} thickness="bold">
            {name}
          </CommonText>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <CommonText lineHeight={1} fontSize={14} thickness="regular">
              {content}
            </CommonText>
            {caption && (
              <CommonText lineHeight={1} fontSize={14} thickness="regular" color="text.secondary">
                {caption}
              </CommonText>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default UserDescription;
