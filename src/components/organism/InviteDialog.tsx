import { inviteUsers } from '@api/invite-users';
import ActionButton from '@components/atom/ActionButton';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import { Add } from '@mui/icons-material';
import { Chip, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useContext, useState } from 'react';

export default function InviteDialog({ subscriptionId }: { subscriptionId: number }) {
  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { addNotice } = useContext(GlobalSnackbarContext);
  const { mutate: inviteUsersMutate } = useMutation({
    mutationFn: () => inviteUsers(subscriptionId, emails),
    onSuccess: () => {
      addNotice('초대 이메일이 발송되었습니다.', 'success');
      setEmails([]);
      setInputValue('');
    },
    onError: () => {
      addNotice('초대 이메일 발송에 실패했습니다.', 'error');
    },
  });

  function handleOpenInviteDialog() {
    console.log('초대 코드 생성');
    inviteUsersMutate();
  }

  function removeEmail(index: number) {
    setEmails(emails.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ' || e.key === 'Tab') {
      e.preventDefault();
      if (inputValue.trim()) {
        setEmails([...emails, inputValue]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace') {
      removeEmail(emails.length - 1);
    }
  }

  return (
    <Stack spacing={3} sx={{ p: 1 }}>
      {/* 헤더 설명 */}
      <Stack spacing={1}>
        <Typography variant="h6" fontWeight="600">
          팀원 초대
        </Typography>
        <Typography variant="body2" color="text.secondary">
          팀원의 이메일 주소를 입력하여 조직에 초대하세요. 초대 이메일이 발송됩니다.
        </Typography>
      </Stack>

      {/* 이메일 입력 영역 */}
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography variant="body2" fontWeight="500">
            초대할 이메일 주소
          </Typography>
          <Stack
            spacing={1}
            sx={{
              minHeight: 56,
              p: 1.5,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
              '&:focus-within': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            }}
          >
            {/* 이메일 뱃지들 */}
            <Stack direction="row" flexWrap="wrap" gap={0.5}>
              {emails.map((email, index) => (
                <Chip
                  key={index}
                  label={email}
                  size="small"
                  onDelete={() => removeEmail(index)}
                  sx={{
                    backgroundColor: 'primary.50',
                    color: 'primary.main',
                    '& .MuiChip-deleteIcon': {
                      color: 'primary.main',
                      '&:hover': {
                        color: 'primary.dark',
                      },
                    },
                  }}
                />
              ))}
            </Stack>

            {/* 이메일 입력 필드 */}
            <TextField
              placeholder="example@email.com"
              fullWidth
              type="email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="standard"
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: {
                    fontSize: '14px',
                    '& input': {
                      p: 0,
                      pb: 1,
                    },
                  },
                },
              }}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            이메일을 입력 후 Enter, 스페이스바 또는 콤마를 눌러 추가하세요
          </Typography>
        </Stack>

        {/* 버튼 그룹 */}
        <Stack direction="row" spacing={2}>
          <ActionButton
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Add />}
            onClick={handleOpenInviteDialog}
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            초대 이메일 보내기
          </ActionButton>
        </Stack>
      </Stack>

      {/* 추가 안내 정보 */}
      <Stack
        spacing={1}
        sx={{
          p: 2,
          bgcolor: 'info.50',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'info.200',
        }}
      >
        <Typography variant="body2" fontWeight="500" color="info.main">
          💡 이메일 초대 안내
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          • 입력한 이메일 주소로 초대 메일이 발송됩니다
          <br />
          • 팀원은 이메일의 링크를 클릭하여 조직에 참가할 수 있습니다
          <br />• 초대 링크는 7일 후 자동으로 만료됩니다
        </Typography>
      </Stack>
    </Stack>
  );
}
