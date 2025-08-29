import { getUserOrganizations } from '@api/get-user-organizations';
import { updateUserOrganization } from '@api/update-user-organization';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { MenuItem, Select, Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

const UserOrganizationSelect: React.FC = () => {
  const queryClient = useQueryClient();
  const { fetchUser } = useContext(AuthenticationContext);
  const { data } = useQuery({
    queryKey: ['user-organizations'],
    queryFn: getUserOrganizations,
  });
  const { mutate: updateUserOrganizationMutation } = useMutation({
    mutationFn: ({ organizationId }: { organizationId: number }) => {
      return updateUserOrganization(organizationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-organizations'] });
      fetchUser();
    },
  });

  const { currentOrganization, organizations } = data?.payload ?? { currentOrganization: null, organizations: [] };

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {currentOrganization && (
        <Select
          size="small"
          value={currentOrganization.id}
          onChange={(e) => {
            const organization = organizations.find((organization) => {
              return organization.id === e.target.value;
            });
            if (organization) {
              updateUserOrganizationMutation({ organizationId: organization.id });
            }
          }}
          sx={{
            fontSize: 12,
          }}
        >
          {organizations.map((organization) => (
            <MenuItem key={organization.id} value={organization.id} sx={{ fontSize: 12 }}>
              {organization.name}
            </MenuItem>
          ))}
        </Select>
      )}
    </Stack>
  );
};

export default UserOrganizationSelect;
