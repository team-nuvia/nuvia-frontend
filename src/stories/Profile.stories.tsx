import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { parameters } from '.storybook/variables';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { Stack } from '@mui/material';
import { PlanNameType } from '@share/enums/plan-name-type.enum';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { UserRole } from '@share/enums/user-role';
import { DateFormat } from '@util/dateFormat';
import { PartialStoryFn } from 'storybook/internal/csf';
import Profile from '../components/template/Profile';

const meta = {
  component: Profile,
} satisfies Meta<typeof Profile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    ...parameters,
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story: PartialStoryFn) => {
      return (
        <AuthenticationContext.Provider
          value={{
            user: {
              id: 1,
              name: 'Devkimson',
              email: 'devkims@gmail.com',
              role: UserRole.Viewer,
              currentOrganization: {
                id: 1,
                name: 'Devkimson',
                description: 'Devkimson',
                target: SubscriptionTargetType.Organization,
                status: SubscriptionStatusType.Active,
                plan: {
                  id: 1,
                  name: PlanNameType.Free,
                  description: 'Free',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  planGrants: [],
                },
                organizationId: 1,
                createdAt: new Date(),
                role: UserRole.Viewer,
              },
              createdAt: DateFormat.toKST(),
              updatedAt: DateFormat.toKST(),
              profileImageUrl: null,
            },
            clearUser: () => Promise.resolve(),
            fetchUser: () => Promise.resolve(),
          }}
        >
          <Stack direction="row" justifyContent="center" sx={{ width: '100%' }}>
            <Story />
          </Stack>
        </AuthenticationContext.Provider>
      );
    },
  ],
  args: {},
};
