'use client';

import { useAuthStore } from '@/store/auth.store';
import { useEventBus } from '@/store/event-bus.store';
import { AppEventType } from '@/store/lib/app-event';
import mutationKeys from '@/store/lib/mutation-key';
import queryKeys from '@/store/lib/query-key';
import { logout } from '@api/auth/logout';
import { changePassword, ChangePasswordData } from '@api/user/change-password';
import { deleteAccount } from '@api/user/delete-account';
import { getUsersMe } from '@api/user/get-users-me';
import { updateNickname } from '@api/user/setting/update-nickname';
import ActionButton from '@components/atom/ActionButton';
import LimitTextField from '@components/atom/LimitTextField';
import PersonalSetting from '@components/template/user/PersonalSetting';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import {
  AccessTime as AccessTimeIcon,
  ArrowBack,
  CalendarToday as CalendarIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Lock,
  Pause as PauseIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Alert, Avatar, Box, Card, CardContent, Container, Divider, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import { SocialProvider } from '@share/enums/social-provider.enum';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DateFormat } from '@util/dateFormat';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';

interface SettingProps {}
const Settings: React.FC<SettingProps> = () => {
  const publish = useEventBus((s) => s.publish);
  const router = useAuthStore((state) => state.router)!;
  const addNotice = useAuthStore((state) => state.addNotice)!;
  const fetchUser = useAuthStore((state) => state.actions.fetchUser);
  const { handleOpenDialog } = useContext(GlobalDialogContext);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 사용자 정보 조회
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: () => getUsersMe().then((res) => res.payload),
  });

  // 사용자 기본 정보 수정 mutation
  const updateUserInfoMutation = useMutation({
    mutationKey: mutationKeys.user.updateUserInfo(),
    mutationFn: ({ nickname }: { nickname: string }) => updateNickname(nickname),
    onSuccess: async (data) => {
      setIsEditingName(false);
      publish({ type: AppEventType.UPDATE_NICKNAME_UPDATED });
      await fetchUser();
      addNotice(data.message ?? '사용자 정보가 수정되었습니다.', 'success');
      // 성공 알림 표시
    },
    onError: (error) => {
      console.error('사용자 정보 수정 실패:', error);
      // 에러 알림 표시
    },
  });

  // 비밀번호 변경 mutation
  const changePasswordMutation = useMutation({
    mutationKey: mutationKeys.user.changePassword(),
    mutationFn: async (data: ChangePasswordData) => changePassword(data),
    onSuccess: (data) => {
      addNotice(data.message ?? '비밀번호 변경되었습니다.', 'success');
      setIsChangingPassword(false);
      // 성공 알림 표시
    },
    onError: (error: AxiosError<ServerResponse<null>>) => {
      console.error(error.response?.data?.message ?? '비밀번호 변경 실패:', error);
      // 에러 알림 표시
    },
  });

  // 계정 휴면 처리 mutation
  // const suspendAccountMutation = useMutation({
  //   mutationKey: mutationKeys.user.suspendAccount(),
  //   mutationFn: async () => suspendAccount(),
  //   onSuccess: (data) => {
  //     // handleCloseDialog();
  //     // 성공 알림 표시
  //     addNotice(data.message ?? '계정 휴면 처리되었습니다.', 'success');
  //   },
  //   onError: (error: AxiosError<ServerResponse<null>>) => {
  //     console.error(error.response?.data?.message ?? '계정 휴면 처리 실패:', error);
  //     // 에러 알림 표시
  //   },
  // });

  // 계정 탈퇴 mutation
  const deleteAccountMutation = useMutation({
    mutationKey: mutationKeys.user.deleteAccount(),
    mutationFn: async () => deleteAccount(),
    onSuccess: async (data) => {
      // setConfirmDialog({ open: false, type: null, title: '', message: '' });
      // 성공 알림 표시
      addNotice(data.message ?? '통합 계정을 삭제했습니다.', 'success');
      await logout();
      handleOpenDialog({
        title: '통합 계정을 삭제했습니다.',
        content: '통합 계정을 삭제했습니다. 다시 로그인해주세요.',
        type: 'info',
        useConfirm: false,
      });
      router.push('/auth/login');
    },
    onError: (error: AxiosError<ServerResponse<null>>) => {
      console.error(error.response?.data?.message ?? '계정 탈퇴 실패:', error);
      // 에러 알림 표시
    },
  });
  // 이름 수정 폼
  const nicknameForm = useFormik({
    initialValues: {
      nickname: user?.nickname || '',
    },
    validationSchema: Yup.object({
      nickname: Yup.string()
        .min(2, '닉네임은 최소 2자 이상이어야 합니다')
        .max(20, '닉네임은 최대 20자까지 가능합니다')
        .matches(/^[a-zA-Z0-9]+$/, '닉네임은 영문 대소문자와 숫자만 가능합니다')
        .required('닉네임을 입력해주세요'),
    }),
    onSubmit: (values) => {
      updateUserInfoMutation.mutate({ nickname: values.nickname });
    },
  });

  // 비밀번호 변경 폼
  const passwordForm = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('현재 비밀번호를 입력해주세요'),
      newPassword: Yup.string()
        .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다')
        .required('새 비밀번호를 입력해주세요'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], '비밀번호가 일치하지 않습니다')
        .required('비밀번호 확인을 입력해주세요'),
    }),
    onSubmit: (values) => {
      changePasswordMutation.mutate(values);
    },
  });

  function handleOpenSuspendDialog() {
    handleOpenDialog({
      title: '계정 휴면 처리',
      content: '준비 중인 기능입니다.',
      type: 'warning',
      useConfirm: false,
      // confirmText: '휴면 처리',
      // actionCallback: () => {
      //   suspendAccountMutation.mutate();
      // },
    });
  }

  function handleOpenDeleteDialog() {
    handleOpenDialog({
      title: '계정 탈퇴',
      content: '통합 계정이 모두 탈퇴 처리되며, 즉시 삭제됩니다. 이 작업은 되돌릴 수 없습니다. 계속 진행하시겠습니까?',
      type: 'error',
      confirmText: '탈퇴하기',
      actionCallback: () => {
        deleteAccountMutation.mutate();
      },
    });
  }

  // const handleOpenDialog = (type: 'suspend' | 'delete') => {
  //   if (type === 'suspend') {
  //     setConfirmDialog({
  //       open: true,
  //       type: 'suspend',
  //       title: '계정 휴면 처리',
  //       message: '계정을 휴면 처리하시겠습니까? 휴면 처리된 계정은 로그인이 제한됩니다.',
  //     });
  //   } else {
  //     setConfirmDialog({
  //       open: true,
  //       type: 'delete',
  //       title: '계정 탈퇴',
  //       message: '정말로 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
  //       actionCallback: () => {
  //         deleteAccountMutation.mutate();
  //       },
  //     });
  //   }
  // };

  // const handleConfirmAction = () => {
  //   if (confirmDialog.type === 'suspend') {
  //     suspendAccountMutation.mutate();
  //   } else if (confirmDialog.type === 'delete') {
  //     deleteAccountMutation.mutate();
  //   }
  // };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  if (error || !user) {
    return <Alert severity="error">사용자 정보를 불러오는 중 오류가 발생했습니다.</Alert>;
  }

  return (
    <Container maxWidth="md" sx={{ p: 3 }}>
      <Stack gap={3}>
        <Stack direction="row" alignItems="center" gap={2} mb={4}>
          <ActionButton
            variant="text"
            size="large"
            startIcon={<ArrowBack />}
            onClick={() => router.push('/user')}
            onMouseEnter={() => router.prefetch('/user')}
          >
            뒤로가기
          </ActionButton>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            사용자 설정
          </Typography>
        </Stack>

        {/* 사용자 기본 정보 */}
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }} src={user?.profileImageUrl ?? undefined} alt={user?.name}>
                <PersonIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  {user?.name}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box p={2} height="100%">
                  <Box display="flex" alignItems="center" mb={1}>
                    <EmailIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      이메일
                    </Typography>
                  </Box>
                  <Typography variant="body1">{user?.email}</Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box p={2} height="100%">
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      가입일
                    </Typography>
                  </Box>
                  <Typography variant="body1">{DateFormat.toUTC('YYYY-MM-dd', user.createdAt)}</Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box p={2}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      최근 접속
                    </Typography>
                  </Box>
                  <Typography variant="body1">{user.lastAccessAt ? DateFormat.getTimeAgo(user.lastAccessAt, 'hour') : 'N/A'}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 이름 수정 */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              기본 정보 수정
            </Typography>

            {!isEditingName ? (
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    닉네임
                  </Typography>
                  <Typography variant="body1">{user?.nickname}</Typography>
                </Box>
                <IconButton onClick={() => setIsEditingName(true)} color="primary">
                  <EditIcon />
                </IconButton>
              </Box>
            ) : (
              <form onSubmit={nicknameForm.handleSubmit}>
                <LimitTextField
                  maxLength={20}
                  label="닉네임"
                  name="nickname"
                  value={user?.nickname ?? nicknameForm.values.nickname}
                  onChange={nicknameForm.handleChange}
                  onBlur={nicknameForm.handleBlur}
                  error={nicknameForm.touched.nickname && Boolean(nicknameForm.errors.nickname)}
                  helperText={nicknameForm.touched.nickname && nicknameForm.errors.nickname}
                  sx={{ mb: 2 }}
                />
                <Box display="flex" gap={1}>
                  <ActionButton type="submit" variant="contained" startIcon={<SaveIcon />} disabled={updateUserInfoMutation.isPending}>
                    저장
                  </ActionButton>
                  <ActionButton
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      setIsEditingName(false);
                      nicknameForm.resetForm();
                    }}
                  >
                    취소
                  </ActionButton>
                </Box>
              </form>
            )}
          </CardContent>
        </Card>

        <PersonalSetting />

        {/* 비밀번호 변경 */}
        {user.provider === SocialProvider.Local && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                비밀번호 변경
              </Typography>

              {!isChangingPassword ? (
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      비밀번호
                    </Typography>
                    <Typography variant="body1">••••••••</Typography>
                  </Box>
                  <ActionButton variant="outlined" startIcon={<SecurityIcon />} onClick={() => setIsChangingPassword(true)}>
                    변경
                  </ActionButton>
                </Box>
              ) : (
                <form onSubmit={passwordForm.handleSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      type="password"
                      label="현재 비밀번호"
                      name="currentPassword"
                      autoComplete="current-password"
                      value={passwordForm.values.currentPassword}
                      onChange={passwordForm.handleChange}
                      onBlur={passwordForm.handleBlur}
                      error={passwordForm.touched.currentPassword && Boolean(passwordForm.errors.currentPassword)}
                      helperText={passwordForm.touched.currentPassword && passwordForm.errors.currentPassword}
                    />
                    <TextField
                      fullWidth
                      type="password"
                      label="새 비밀번호"
                      name="newPassword"
                      autoComplete="new-password"
                      value={passwordForm.values.newPassword}
                      onChange={passwordForm.handleChange}
                      onBlur={passwordForm.handleBlur}
                      error={passwordForm.touched.newPassword && Boolean(passwordForm.errors.newPassword)}
                      helperText={passwordForm.touched.newPassword && passwordForm.errors.newPassword}
                    />
                    <TextField
                      fullWidth
                      type="password"
                      label="새 비밀번호 확인"
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={passwordForm.values.confirmPassword}
                      onChange={passwordForm.handleChange}
                      onBlur={passwordForm.handleBlur}
                      error={passwordForm.touched.confirmPassword && Boolean(passwordForm.errors.confirmPassword)}
                      helperText={passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword}
                    />
                    <Box display="flex" gap={1}>
                      <ActionButton type="submit" variant="contained" startIcon={<SaveIcon />} disabled={changePasswordMutation.isPending}>
                        변경
                      </ActionButton>
                      <ActionButton
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          setIsChangingPassword(false);
                          passwordForm.resetForm();
                        }}
                      >
                        취소
                      </ActionButton>
                    </Box>
                  </Stack>
                </form>
              )}
            </CardContent>
          </Card>
        )}
        {user.provider !== SocialProvider.Local && (
          <Card variant="outlined">
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lock color="warning" />
              <Typography variant="body1">소셜 로그인 사용자는 비밀번호 변경이 불가능합니다.</Typography>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
        <Card variant="outlined" sx={{ borderWidth: 2, borderColor: 'error.main' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <WarningIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6" color="error.main">
                Danger Zone
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              다음 작업들은 되돌릴 수 없으므로 신중하게 결정해주세요.
            </Typography>

            <Stack spacing={2}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle1">계정 휴면 처리</Typography>
                  <Typography variant="body2" color="text.secondary">
                    계정을 일시적으로 비활성화합니다.
                  </Typography>
                </Box>
                <ActionButton variant="outlined" color="warning" startIcon={<PauseIcon />} onClick={handleOpenSuspendDialog}>
                  휴면 처리
                </ActionButton>
              </Box>

              <Divider />

              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle1">계정 탈퇴</Typography>
                  <Typography variant="body2" color="text.secondary">
                    계정과 모든 데이터를 영구적으로 삭제합니다.
                  </Typography>
                </Box>
                <ActionButton variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleOpenDeleteDialog}>
                  탈퇴하기
                </ActionButton>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* 확인 다이얼로그
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, type: null, title: '', message: '' })} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <WarningIcon color="error" sx={{ mr: 1 }} />
            {confirmDialog.title}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, type: null, title: '', message: '' })}>취소</Button>
          <Button
            onClick={handleConfirmAction}
            color="error"
            variant="contained"
            disabled={suspendAccountMutation.isPending || deleteAccountMutation.isPending}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog> */}
      </Stack>
    </Container>
  );
};

export default Settings;
