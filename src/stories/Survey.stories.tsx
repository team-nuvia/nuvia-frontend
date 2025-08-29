import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Survey from './Survey';

const meta = {
  component: Survey,
} satisfies Meta<typeof Survey>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <Story />
      </LocalizationProvider>
    ),
  ],
  args: {},
};
