import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { decorators, parameters } from '.storybook/variables';
import { BRAND_NAME } from '@common/variables';
import BrandHead from '../components/molecular/BrandHead';

const meta = {
  component: BrandHead,
} satisfies Meta<typeof BrandHead>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    ...parameters,
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [decorators],
  args: {
    title: BRAND_NAME,
    width: 45,
    height: 45,
    primaryColor: '#000000',
    secondaryColor: '#000000',
  },
};
