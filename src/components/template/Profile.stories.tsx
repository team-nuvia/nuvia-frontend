import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { parameters } from '.storybook/variables';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { Stack } from '@mui/material';
import { UserRole } from '@share/enums/user-role';
import { PartialStoryFn } from 'storybook/internal/csf';
import Profile from './Profile';

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
              role: UserRole.User,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            setUser: () => {},
            clearUser: () => {},
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
