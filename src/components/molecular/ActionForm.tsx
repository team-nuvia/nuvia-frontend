import { useAuthStore } from '@/store/auth.store';
import { API_URL } from '@common/variables';
import ActionButton from '@components/atom/ActionButton';
import { Stack } from '@mui/material';
import { SocialProvider } from '@share/enums/social-provider.enum';
import { detectBrowser } from '@util/detectBrowser';
import { detectUserDevice } from '@util/detectUserDevice';
import { useEffect } from 'react';

interface ActionFormProps {
  title: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
  socialLogin?: SocialProvider[];
  slots: React.ReactNode;
  signupPath?: string;
  signupText?: string;
  isLoading?: boolean;
}
const ActionForm: React.FC<ActionFormProps> = ({ title, onSubmit, submitText, slots, signupPath, signupText, isLoading, socialLogin }) => {
  const router = useAuthStore((state) => state.router)!;

  useEffect(() => {
    const nq = localStorage.getItem('nq');
    if (nq) {
      window.location.search = nq;
      localStorage.removeItem('nq');
    }
  }, []);

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
        backgroundColor: 'background.paper',
      }}
      onSubmit={onSubmit}
    >
      {title}
      <Stack gap={2}>
        {slots}
        <ActionButton size="xlarge" variant="contained" fullWidth type="submit" isLoading={isLoading}>
          {submitText}
        </ActionButton>
        {socialLogin?.map((provider) => (
          <ActionButton
            key={provider}
            size="xlarge"
            variant="contained"
            fullWidth
            type="button"
            onClick={() => {
              const url = new URL(`${API_URL}/auth/login/${provider}`);
              url.searchParams.set('accessDevice', detectUserDevice());
              url.searchParams.set('accessBrowser', detectBrowser());
              url.searchParams.set('accessUserAgent', navigator.userAgent);
              window.location.href = url.toString();
              localStorage.setItem('nq', window.location.search);
            }}
          >
            {provider.toUpperCase()}
          </ActionButton>
        ))}
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
