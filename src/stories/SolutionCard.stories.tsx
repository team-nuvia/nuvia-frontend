import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import AddIcon from '@mui/icons-material/Add';
import SolutionCard from './SolutionCard';

const meta = {
  component: SolutionCard,
} satisfies Meta<typeof SolutionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <AddIcon />,
    title: 'title',
    description: 'description',
  },
};
