import CommonText from '@components/atom/CommonText';
import { Avatar, Skeleton, Stack } from '@mui/material';

interface UserDescriptionProps {
  name: string;
  caption?: string;
  content: React.ReactNode;
  nameSize?: number;
  profileImage: string | null;
  isVisible?: boolean;
  isLoading?: boolean;
}
const UserDescription: React.FC<UserDescriptionProps> = ({
  name,
  caption,
  content,
  nameSize = 16,
  profileImage,
  isVisible = false,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={2} mb={2}>
        <Skeleton variant="circular" width={35} height={35} />
        {isVisible && (
          <Stack direction="column" justifyContent="center" gap={0.5} sx={{ whiteSpace: 'nowrap' }}>
            <Skeleton variant="rounded" width={140} height={14} />
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Skeleton variant="rounded" width={38} height={14} />
              {caption && <Skeleton variant="rounded" width={38} height={14} />}
            </Stack>
          </Stack>
        )}
      </Stack>
    );
  }

  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={2} px={0.5} mb={2}>
      <Avatar src={profileImage ?? 'https://github.com/shadcn.png'} sx={{ width: 35, height: 35 }} />
      {isVisible && (
        <Stack
          direction="column"
          justifyContent="center"
          gap={0.5}
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
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
