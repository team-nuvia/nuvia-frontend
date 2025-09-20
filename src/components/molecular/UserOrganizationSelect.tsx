import { getUserOrganizations } from '@api/get-user-organizations';
import { updateUserOrganization } from '@api/update-user-organization';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import { MenuItem, Select, Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

const UserOrganizationSelect: React.FC = () => {
  const pathname = usePathname();
  const { handleOpenDialog } = useContext(GlobalDialogContext);
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
      queryClient.invalidateQueries({ queryKey: ['dashboard-metadata'] });
      queryClient.invalidateQueries({ queryKey: ['daily-response-count'] });
      queryClient.invalidateQueries({ queryKey: ['surveyList'] });
      queryClient.invalidateQueries({ queryKey: ['surveyMetadata'] });

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
              if (pathname.startsWith('/dashboard/survey/create')) {
                handleOpenDialog({
                  title: '사이트를 새로고침하시겠습니까?',
                  content: '변경사항이 저장되지 않을 수 있습니다.',
                  confirmText: '새로고침',
                  cancelText: '취소',
                  useConfirm: true,
                  actionCallback: () => {
                    window.location.reload();
                    updateUserOrganizationMutation({ organizationId: organization.id });
                  },
                });
              } else {
                updateUserOrganizationMutation({ organizationId: organization.id });
              }
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
