import ActionButton from '@components/atom/ActionButton';
import CommonText from '@components/atom/CommonText';
import { Stack, TextField } from '@mui/material';
import { useState } from 'react';

interface ActionFormProps {
  title: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
  slots: React.ReactNode;
}
const ActionForm: React.FC<ActionFormProps> = ({
  title,
  onSubmit,
  submitText,
  slots,
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
      <CommonText variant="h5" gutterBottom>
        {title}
      </CommonText>

      <Stack gap={2}>
        {slots}
        <ActionButton variant="contained" fullWidth type="submit">
          {submitText}
        </ActionButton>
      </Stack>
    </Stack>
  );
};

export default ActionForm;
