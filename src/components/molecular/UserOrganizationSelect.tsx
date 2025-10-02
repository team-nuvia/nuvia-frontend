import { useAuthStore } from '@/store/auth.store';
import { useEventBus } from '@/store/event-bus.store';
import { AppEventType } from '@/store/lib/app-event';
import queryKeys from '@/store/lib/query-key';
import { getUserOrganizations } from '@api/user/get-user-organizations';
import { updateUserOrganization } from '@api/user/update-user-organization';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import { MenuItem, Select, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

const UserOrganizationSelect: React.FC = () => {
  const pathname = usePathname();
  const publish = useEventBus((s) => s.publish);
  const { handleOpenDialog } = useContext(GlobalDialogContext);
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.actions.fetchUser);
  const { data } = useQuery({
    queryKey: queryKeys.organization.list(),
    queryFn: getUserOrganizations,
    enabled: !!user,
  });
  const { mutate: updateUserOrganizationMutation } = useMutation({
    mutationFn: ({ organizationId }: { organizationId: number }) => {
      return updateUserOrganization(organizationId);
    },
    onSuccess: async () => {
      await fetchUser();
      publish({ type: AppEventType.ORGANIZATION_UPDATED });
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
