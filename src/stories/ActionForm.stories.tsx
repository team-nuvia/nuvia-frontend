import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextField } from '@mui/material';
import { Fragment } from 'react';
import ActionForm from '../components/molecular/ActionForm';

const meta = {
  component: ActionForm,
} satisfies Meta<typeof ActionForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // @ts-ignore
    formRef: { current: null },
    title: '로그인',
    slots: (
      <Fragment>
        <TextField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
        />
      </Fragment>
    ),
    onSubmit: (e) => {
      const formData = new FormData(e.target as HTMLFormElement);
      console.log(formData.get('email'));
      console.log(formData.get('password'));
    },
    submitText: '로그인',
  },
};
