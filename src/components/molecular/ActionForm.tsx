import ActionButton from '@components/atom/ActionButton';
import { Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ActionFormProps {
  title: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
  slots: React.ReactNode;
  signupPath?: string;
  signupText?: string;
}
const ActionForm: React.FC<ActionFormProps> = ({ title, onSubmit, submitText, slots, signupPath, signupText }) => {
  const router = useRouter();
  return (
    <Stack
      p={5}
      component="form"
      noValidate
      gap={2}
      sx={{
        borderWidth: 1,
        borderColor: 'divider',
        borderStyle: 'solid',
        borderRadius: 4,
      }}
      onSubmit={onSubmit}
    >
      {title}
      <Stack gap={2}>
        {slots}
        <ActionButton size="xlarge" variant="contained" fullWidth type="submit">
          {submitText}
        </ActionButton>
        {signupPath && (
          <ActionButton size="xlarge" variant="text" fullWidth type="button" onClick={() => router.push(signupPath)}>
            {signupText}
          </ActionButton>
        )}
      </Stack>
    </Stack>
  );
};

export default ActionForm;
