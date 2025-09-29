'use client';

import { getUsersMe } from '@api/get-users-me';
import {
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Pause as PauseIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DateFormat } from '@util/dateFormat';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';

interface UpdateUserInfoData {
  name: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SettingProps {}

const Settings: React.FC<SettingProps> = () => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'suspend' | 'delete' | null;
    title: string;
    message: string;
  }>({
    open: false,
    type: null,
    title: '',
    message: '',
  });

  // 사용자 정보 조회
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUsersMe().then((res) => res.payload),
  });

  // 사용자 기본 정보 수정 mutation
  const updateUserInfoMutation = useMutation({
    mutationFn: async (data: UpdateUserInfoData) => {
      // 실제 API 호출 코드는 여기에 구현
      console.log('사용자 정보 수정:', data);
      return data;
    },
    onSuccess: () => {
      setIsEditingName(false);
      // 성공 알림 표시
    },
    onError: (error) => {
      console.error('사용자 정보 수정 실패:', error);
      // 에러 알림 표시
    },
  });

  // 비밀번호 변경 mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      // 실제 API 호출 코드는 여기에 구현
      console.log('비밀번호 변경:', data);
      return data;
    },
    onSuccess: () => {
      setIsChangingPassword(false);
      // 성공 알림 표시
    },
    onError: (error) => {
      console.error('비밀번호 변경 실패:', error);
      // 에러 알림 표시
    },
  });

  // 계정 휴면 처리 mutation
  const suspendAccountMutation = useMutation({
    mutationFn: async () => {
      // 실제 API 호출 코드는 여기에 구현
      console.log('계정 휴면 처리');
      return true;
    },
    onSuccess: () => {
      setConfirmDialog({ open: false, type: null, title: '', message: '' });
      // 성공 알림 표시
    },
    onError: (error) => {
      console.error('계정 휴면 처리 실패:', error);
      // 에러 알림 표시
    },
  });

  // 계정 탈퇴 mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      // 실제 API 호출 코드는 여기에 구현
      console.log('계정 탈퇴');
      return true;
    },
    onSuccess: () => {
      setConfirmDialog({ open: false, type: null, title: '', message: '' });
      // 성공 알림 표시
    },
    onError: (error) => {
      console.error('계정 탈퇴 실패:', error);
      // 에러 알림 표시
    },
  });

  // 이름 수정 폼
  const nameForm = useFormik({
    initialValues: {
      name: user?.name || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, '이름은 최소 2자 이상이어야 합니다').max(20, '이름은 최대 20자까지 가능합니다').required('이름을 입력해주세요'),
    }),
    onSubmit: (values) => {
      updateUserInfoMutation.mutate(values);
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

  const handleOpenDialog = (type: 'suspend' | 'delete') => {
    if (type === 'suspend') {
      setConfirmDialog({
        open: true,
        type: 'suspend',
        title: '계정 휴면 처리',
        message: '계정을 휴면 처리하시겠습니까? 휴면 처리된 계정은 로그인이 제한됩니다.',
      });
    } else {
      setConfirmDialog({
        open: true,
        type: 'delete',
        title: '계정 탈퇴',
        message: '정말로 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      });
    }
  };

  const handleConfirmAction = () => {
    if (confirmDialog.type === 'suspend') {
      suspendAccountMutation.mutate();
    } else if (confirmDialog.type === 'delete') {
      deleteAccountMutation.mutate();
    }
  };

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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        사용자 설정
      </Typography>

      {/* 사용자 기본 정보 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
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
              <Paper sx={{ p: 2, height: '100%' }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <EmailIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    이메일
                  </Typography>
                </Box>
                <Typography variant="body1">{user?.email}</Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    가입일
                  </Typography>
                </Box>
                <Typography variant="body1">{DateFormat.toKST('YYYY-MM-dd', user.createdAt)}</Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    최근 접속
                  </Typography>
                </Box>
                <Typography variant="body1">{DateFormat.toKST('YYYY-MM-dd HH:mm', user.lastLoginAt)}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 이름 수정 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            기본 정보 수정
          </Typography>

          {!isEditingName ? (
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  이름
                </Typography>
                <Typography variant="body1">{user?.name}</Typography>
              </Box>
              <IconButton onClick={() => setIsEditingName(true)} color="primary">
                <EditIcon />
              </IconButton>
            </Box>
          ) : (
            <form onSubmit={nameForm.handleSubmit}>
              <TextField
                fullWidth
                label="이름"
                name="name"
                value={nameForm.values.name}
                onChange={nameForm.handleChange}
                onBlur={nameForm.handleBlur}
                error={nameForm.touched.name && Boolean(nameForm.errors.name)}
                helperText={nameForm.touched.name && nameForm.errors.name}
                sx={{ mb: 2 }}
              />
              <Box display="flex" gap={1}>
                <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={updateUserInfoMutation.isPending}>
                  저장
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => {
                    setIsEditingName(false);
                    nameForm.resetForm();
                  }}
                >
                  취소
                </Button>
              </Box>
            </form>
          )}
        </CardContent>
      </Card>

      {/* 비밀번호 변경 */}
      <Card sx={{ mb: 3 }}>
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
              <Button variant="outlined" startIcon={<SecurityIcon />} onClick={() => setIsChangingPassword(true)}>
                변경
              </Button>
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
                  <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={changePasswordMutation.isPending}>
                    변경
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      setIsChangingPassword(false);
                      passwordForm.resetForm();
                    }}
                  >
                    취소
                  </Button>
                </Box>
              </Stack>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card sx={{ border: '2px solid', borderColor: 'error.main' }}>
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
              <Button variant="outlined" color="warning" startIcon={<PauseIcon />} onClick={() => handleOpenDialog('suspend')}>
                휴면 처리
              </Button>
            </Box>

            <Divider />

            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle1">계정 탈퇴</Typography>
                <Typography variant="body2" color="text.secondary">
                  계정과 모든 데이터를 영구적으로 삭제합니다.
                </Typography>
              </Box>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleOpenDialog('delete')}>
                탈퇴하기
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* 확인 다이얼로그 */}
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
      </Dialog>
    </Box>
  );
};

export default Settings;
