import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import BrandHead from './BrandHead';
import { BRAND_NAME, LOGO_ONLY } from '@common/variables';
import { decorators, parameters } from '.storybook/variables';

const meta = {
  component: BrandHead,
} satisfies Meta<typeof BrandHead>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters,
  decorators: [decorators],
  args: {
    title: BRAND_NAME,
    logo: LOGO_ONLY,
    width: 45,
    height: 45,
  },
};
