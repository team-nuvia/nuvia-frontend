import ActionButton from '@components/atom/ActionButton';
import CommonText from '@components/atom/CommonText';
import { Stack } from '@mui/material';
import { useState } from 'react';

interface ActionFormProps {
  title: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
  slots: React.ReactNode;
  signupPath?: string;
  signupText?: string;
}
const ActionForm: React.FC<ActionFormProps> = ({
  title,
  onSubmit,
  submitText,
  slots,
  signupPath,
  signupText,
}) => {
  const [formData, setFormData] = useState<Partial<Record<string, any>>>({
    email: '',
    password: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Stack
      p={5}
      component="form"
      gap={2}
      sx={{
        borderWidth: 1,
        borderColor: 'divider',
        borderStyle: 'solid',
        borderRadius: 4,
      }}
      onSubmit={(e) => {
        e.preventDefault();
        if (Object.values(formData).some(Boolean)) {
          return false;
        }
        onSubmit(e);
      }}
    >
      {title}
      <Stack gap={2}>
        {slots}
        <ActionButton size="xlarge" variant="contained" fullWidth type="submit">
          {submitText}
        </ActionButton>
        {signupPath && (
          <ActionButton size="xlarge" variant="text" fullWidth type="button">
            {signupText}
          </ActionButton>
        )}
      </Stack>
    </Stack>
  );
};

export default ActionForm;
