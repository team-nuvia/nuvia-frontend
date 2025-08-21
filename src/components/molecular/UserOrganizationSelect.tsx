import { getUserOrganizations } from '@api/get-user-organizations';
import { updateUserOrganization } from '@api/update-user-organization';
import ActionButton from '@components/atom/ActionButton';
import InviteDialog from '@components/organism/InviteDialog';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { MenuItem, Select, Stack } from '@mui/material';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { UserRole, UserRoleList } from '@share/enums/user-role';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

interface UserOrganizationSelectProps {
  refetchCallback: () => void;
}
const UserOrganizationSelect: React.FC<UserOrganizationSelectProps> = ({ refetchCallback }) => {
  const { data, refetch } = useQuery({
    queryKey: ['user-organizations'],
    queryFn: getUserOrganizations,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
  });
  const { handleOpenDialog } = useContext(GlobalDialogContext);
  const { mutate: updateUserOrganizationMutation } = useMutation({
    mutationFn: ({ organizationId }: { organizationId: number }) => {
      return updateUserOrganization(organizationId);
    },
    onSuccess: () => {
      refetch();
      refetchCallback();
    },
  });

  const handleOpenInviteDialog = () => {
    handleOpenDialog({
      title: '초대 코드 생성',
      content: <InviteDialog subscriptionId={currentOrganization?.id} />,
      useConfirm: false,
    });
  };

  if (!data || !data.payload) {
    return null;
  }

  const { currentOrganization, organizations } = data.payload;

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Select
        size="small"
        value={currentOrganization?.id}
        onChange={(e) => {
          const organization = organizations?.find((organization) => {
            return organization.id === e.target.value;
          });
          if (organization) {
            updateUserOrganizationMutation({ organizationId: organization.id });
          }
        }}
      >
        {organizations?.map((organization) => (
          <MenuItem key={organization.id} value={organization.id}>
            {organization.name}
          </MenuItem>
        ))}
      </Select>
      {UserRoleList.indexOf(currentOrganization.permission.role) >= UserRoleList.indexOf(UserRole.Admin) &&
        currentOrganization.target === SubscriptionTargetType.Organization && (
          <ActionButton variant="contained" color="primary" size="medium" startIcon={<GroupAddIcon />} onClick={handleOpenInviteDialog}>
            초대 코드 생성
          </ActionButton>
        )}
    </Stack>
  );
};

export default UserOrganizationSelect;
