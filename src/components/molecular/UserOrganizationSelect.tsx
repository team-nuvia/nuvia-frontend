import { getUserOrganizations } from '@api/get-user-organizations';
import { updateUserOrganization } from '@api/update-user-organization';
import { MenuItem, Select } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';

interface UserOrganizationSelectProps {
  refetchCallback: () => void;
}
const UserOrganizationSelect: React.FC<UserOrganizationSelectProps> = ({ refetchCallback }) => {
  const { data, refetch } = useQuery({
    queryKey: ['user-organizations'],
    queryFn: getUserOrganizations,
  });

  const { mutate: updateUserOrganizationMutation } = useMutation({
    mutationFn: ({ organizationId }: { organizationId: number }) => {
      return updateUserOrganization(organizationId);
    },
    onSuccess: () => {
      refetch();
      refetchCallback();
    },
  });

  if (!data || !data.payload) {
    return null;
  }

  const { currentOrganization, organizations } = data.payload;

  return (
    <Select
      value={currentOrganization?.id}
      onChange={(e) => {
        const organization = organizations?.find((organization) => {
          return organization.id === e.target.value;
        });
        console.log('🚀 ~ organization:', organization);
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
  );
};

export default UserOrganizationSelect;
