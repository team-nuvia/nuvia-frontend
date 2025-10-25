'use client';

import { useAuthStore } from '@/store/auth.store';
import { useEventBus } from '@/store/event-bus.store';
import { AppEventType } from '@/store/lib/app-event';
import mutationKeys from '@/store/lib/mutation-key';
import queryKeys from '@/store/lib/query-key';
import { getOrganizationSettings } from '@api/organization/get-organization-settings';
import { updateOrganizationSettings, UpdateOrganizationSettingsPayload } from '@api/organization/update-organization-settings';
import ActionButton from '@components/atom/ActionButton';
import FixedSkeleton from '@components/atom/FixedSkeleton';
import OutlineStack from '@components/atom/OutlineStack';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ResponseFormat } from '@share/enums/response-format';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { UserRole } from '@share/enums/user-role';
import { useMutation, useQuery } from '@tanstack/react-query';
import { roleAtLeast } from '@util/roleAtLeast';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';

const TinyText = ({ children, fontSize = 8, color = 'text.secondary' }: { children: React.ReactNode; fontSize?: number; color?: string }) => {
  return (
    <Typography variant="caption" color={color} fontSize={fontSize}>
      {children}
    </Typography>
  );
};

const SIZE = 150;

const SlidePreview = () => {
  return (
    <Box
      sx={{
        p: 2,
        gap: 1,
        width: SIZE,
        height: 'auto',
        borderRadius: 1,
        bgcolor: '#f5f5f7',
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 설문 정보 */}
      <OutlineStack
        gap={0.3}
        p={1}
        sx={{
          borderRadius: 0.5,
        }}
      >
        <Stack direction="row" gap={0.4} alignItems="center">
          <FixedSkeleton width={8} height={8} borderRadius={10} />
          <FixedSkeleton width={50} height={4} borderRadius={1} />
        </Stack>
        <FixedSkeleton width={80} height={6} borderRadius={1} />
        <Stack gap={0.4} mt={0.5}>
          <FixedSkeleton width="100%" height={4} borderRadius={1} />
          <FixedSkeleton width={50} height={4} borderRadius={1} />
        </Stack>
      </OutlineStack>

      {/* 진행률 */}
      <OutlineStack
        gap={0.3}
        p={1}
        sx={{
          borderRadius: 0.5,
        }}
      >
        <TinyText>진행률</TinyText>
        <FixedSkeleton width="100%" height={3} borderRadius={1} />
      </OutlineStack>

      {/* 질문 */}
      <OutlineStack
        gap={0.3}
        p={1}
        sx={{
          borderRadius: 0.5,
        }}
      >
        <Stack direction="row" gap={0.3} justifyContent="space-between" alignItems="center">
          <TinyText>질문</TinyText>
          <Stack direction="row" gap={0.3} alignItems="center">
            <FixedSkeleton width={10} height={6} borderRadius={1} />
            <FixedSkeleton width={10} height={6} borderRadius={1} />
          </Stack>
        </Stack>
        <FixedSkeleton width="100%" height={4} borderRadius={1} />
        <FixedSkeleton width="100%" height={4} borderRadius={1} />
      </OutlineStack>

      {/* 설문 질문 현재 위치 */}
      <Stack direction="row" gap={0.3} justifyContent="center" alignItems="center">
        <FixedSkeleton width={6} height={6} borderRadius={6} />
        <FixedSkeleton width={6} height={6} borderRadius={6} />
        <FixedSkeleton width={6} height={6} borderRadius={6} />
      </Stack>

      {/* 제어 버튼 */}
      <Stack direction="row" gap={0.3} justifyContent="space-between" alignItems="center" mt={0.5}>
        <FixedSkeleton width={20} height={6} borderRadius={1} />
        <Stack direction="row" gap={0.3} justifyContent="space-between" alignItems="center">
          <FixedSkeleton width={20} height={6} borderRadius={1} />
          <FixedSkeleton width={20} height={6} borderRadius={1} />
        </Stack>
      </Stack>
    </Box>
  );
};
const VerticalScrollPreview = () => {
  return (
    <Box
      sx={{
        p: 2,
        gap: 1,
        width: SIZE,
        height: 'auto',
        borderRadius: 1,
        bgcolor: '#f5f5f7',
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 설문 정보 */}
      <OutlineStack
        gap={0.3}
        p={1}
        sx={{
          borderRadius: 0.5,
        }}
      >
        <Stack direction="row" gap={0.4} alignItems="center">
          <FixedSkeleton width={8} height={8} borderRadius={10} />
          <FixedSkeleton width={50} height={4} borderRadius={1} />
        </Stack>
        <FixedSkeleton width={80} height={6} borderRadius={1} />
        <Stack gap={0.4} mt={0.5}>
          <FixedSkeleton width="100%" height={4} borderRadius={1} />
          <FixedSkeleton width={50} height={4} borderRadius={1} />
        </Stack>
      </OutlineStack>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" gap={0.8}>
        <Box overflow="hidden" maxHeight={99} flex={1}>
          <Stack gap={0.5} top={-15} position="relative">
            {/* 진행률 */}
            <OutlineStack
              gap={0.3}
              p={1}
              sx={{
                borderRadius: 0.5,
              }}
            >
              <TinyText>진행률</TinyText>
              <FixedSkeleton width="100%" height={3} borderRadius={1} />
            </OutlineStack>

            {/* 질문 */}
            <OutlineStack
              gap={0.3}
              p={1}
              sx={{
                borderRadius: 0.5,
              }}
            >
              <Stack direction="row" gap={0.3} justifyContent="space-between" alignItems="center">
                <TinyText>질문</TinyText>
                <Stack direction="row" gap={0.3} alignItems="center">
                  <FixedSkeleton width={10} height={6} borderRadius={1} />
                  <FixedSkeleton width={10} height={6} borderRadius={1} />
                </Stack>
              </Stack>
              <FixedSkeleton width="100%" height={4} borderRadius={1} />
              <FixedSkeleton width="100%" height={4} borderRadius={1} />
            </OutlineStack>
            <OutlineStack
              gap={0.3}
              p={1}
              sx={{
                borderRadius: 0.5,
              }}
            >
              <Stack direction="row" gap={0.3} justifyContent="space-between" alignItems="center">
                <TinyText>질문</TinyText>
                <Stack direction="row" gap={0.3} alignItems="center">
                  <FixedSkeleton width={10} height={6} borderRadius={1} />
                  <FixedSkeleton width={10} height={6} borderRadius={1} />
                </Stack>
              </Stack>
              <FixedSkeleton width="100%" height={4} borderRadius={1} />
              <FixedSkeleton width="100%" height={4} borderRadius={1} />
            </OutlineStack>
            <OutlineStack
              gap={0.3}
              p={1}
              sx={{
                borderRadius: 0.5,
              }}
            >
              <Stack direction="row" gap={0.3} justifyContent="space-between" alignItems="center">
                <TinyText>질문</TinyText>
                <Stack direction="row" gap={0.3} alignItems="center">
                  <FixedSkeleton width={10} height={6} borderRadius={1} />
                  <FixedSkeleton width={10} height={6} borderRadius={1} />
                </Stack>
              </Stack>
              <FixedSkeleton width="100%" height={4} borderRadius={1} />
              <FixedSkeleton width="100%" height={4} borderRadius={1} />
            </OutlineStack>
          </Stack>
        </Box>
        <Stack bgcolor="grey.300" justifySelf="stretch" height={99} width={4}>
          <Box my={1} />
          <FixedSkeleton color="grey.500" width={4} height={40} />
        </Stack>
      </Stack>

      {/* 제어 버튼 */}
      <Stack direction="row" gap={0.3} justifyContent="space-between" alignItems="center" mt={0.5}>
        <FixedSkeleton width={20} height={6} borderRadius={1} />
        <Stack direction="row" gap={0.3} justifyContent="space-between" alignItems="center">
          <FixedSkeleton width={20} height={6} borderRadius={1} />
          <FixedSkeleton width={20} height={6} borderRadius={1} />
        </Stack>
      </Stack>
    </Box>
  );
};

interface OrganizationSettingProps {}
const OrganizationSetting: React.FC<OrganizationSettingProps> = () => {
  const publish = useEventBus((s) => s.publish);
  const [responseFormat, setResponseFormat] = useState<ResponseFormat>(ResponseFormat.Slide);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [teamDefaultRole, setTeamDefaultRole] = useState<UserRole>(UserRole.Viewer);
  const addNotice = useAuthStore((state) => state.addNotice)!;
  const subscriptionId = useAuthStore((state) => state.user?.currentOrganization?.organizationId ?? 0);
  const user = useAuthStore((state) => state.user);
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.organization.settings(subscriptionId),
    queryFn: () => getOrganizationSettings(subscriptionId),
    enabled: !!user,
  });

  const { mutate: updateOrganizationSettingsMutation } = useMutation({
    mutationKey: mutationKeys.organization.settings(subscriptionId),
    mutationFn: (payload: UpdateOrganizationSettingsPayload) => updateOrganizationSettings(subscriptionId, payload),
    onSuccess: (data) => {
      addNotice('설정이 저장되었습니다.', 'success');
      publish({ type: AppEventType.ORGANIZATION_SETTINGS_UPDATED, payload: { subscriptionId } });
    },
    onError: (error: AxiosError<ServerResponse<any>>) => {
      addNotice(error.response?.data?.message ?? '설정 저장에 실패했습니다.', 'error');
    },
  });

  useEffect(() => {
    if (data?.payload?.responseFormat) {
      setResponseFormat(data.payload.responseFormat);
    }
    if (data?.payload?.teamName) {
      setTeamName(data.payload.teamName);
    }
    if (data?.payload?.teamDescription) {
      setTeamDescription(data.payload.teamDescription);
    }
    if (data?.payload?.teamDefaultRole) {
      setTeamDefaultRole(data.payload.teamDefaultRole);
    }
    if (data?.payload?.responseFormat) {
      setResponseFormat(data.payload.responseFormat);
    }
  }, [
    data?.payload?.responseFormat,
    data?.payload?.teamName,
    data?.payload?.teamDescription,
    data?.payload?.teamDefaultRole,
    data?.payload?.responseFormat,
  ]);

  const canEdit = roleAtLeast(UserRole.Admin, user?.role);

  const previewRender = useMemo(() => {
    switch (responseFormat) {
      case ResponseFormat.Slide:
        return <SlidePreview />;
      case ResponseFormat.Scroll:
        return <VerticalScrollPreview />;
    }
  }, [responseFormat]);

  const handleDefaultInfoUpdate = useCallback(() => {
    if (teamName === data?.payload?.teamName && teamDescription === data?.payload?.teamDescription) {
      addNotice('변경된 내용이 없습니다.', 'info');
      return;
    }
    updateOrganizationSettingsMutation({ teamName, teamDescription });
  }, [teamName, teamDescription, data?.payload?.teamName, data?.payload?.teamDescription]);

  const handleDefaultRoleUpdate = useCallback(() => {
    if (teamDefaultRole === data?.payload?.teamDefaultRole) {
      addNotice('변경된 내용이 없습니다.', 'info');
      return;
    }
    if (teamDefaultRole === UserRole.Owner) {
      addNotice('소유자 역할은 기본 역할로 설정할 수 없습니다.', 'warning');
      return;
    }
    updateOrganizationSettingsMutation({ teamDefaultRole });
  }, [teamDefaultRole, data?.payload?.teamDefaultRole]);

  const handleResponseFormatUpdate = useCallback(() => {
    addNotice('준비중인 기능입니다.', 'info');

    // if (responseFormat === data?.payload?.responseFormat) {
    //   addNotice('변경된 내용이 없습니다.', 'info');
    //   return;
    // }
    // updateOrganizationSettingsMutation({ responseFormat });
  }, [responseFormat, data?.payload?.responseFormat]);

  return (
    <Container maxWidth="md" sx={{ p: 5 }}>
      <Stack gap={4}>
        <Box>
          <Typography variant="h4" fontWeight={800} mb={1}>
            조직 설정
          </Typography>
          <Typography variant="body2" color="text.secondary">
            팀 기본 정보와 멤버 초대 정책을 관리합니다. 권한: 관리자 이상
          </Typography>
        </Box>

        {!canEdit && (
          <Alert severity="info" variant="outlined">
            이 페이지는 보기 전용입니다. 변경은 관리자(Admin) 이상만 할 수 있습니다.
          </Alert>
        )}

        <Divider />

        {/* 팀 기본 정보 */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>
              팀 기본 정보
            </Typography>
            {isLoading ? (
              <Stack gap={2}>
                <Skeleton variant="rounded" height={56} />
                <Skeleton variant="rounded" height={120} />
                <Skeleton variant="rounded" width={140} height={36} />
              </Stack>
            ) : (
              <Stack gap={3}>
                <TextField
                  label="팀명"
                  placeholder="팀명을 입력하세요"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  disabled={!canEdit}
                  fullWidth
                />
                <TextField
                  label="팀 설명"
                  placeholder="팀 설명을 입력하세요"
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  disabled={!canEdit}
                  fullWidth
                  multiline
                  minRows={3}
                />
                <Box>
                  <Button variant="contained" disabled={!canEdit} onClick={handleDefaultInfoUpdate}>
                    {canEdit ? '저장' : '권한 없음'}
                  </Button>
                </Box>
              </Stack>
            )}
          </CardContent>
        </Card>

        <Divider />

        {/* 기본 부여 역할 */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>
              초대 시 기본 부여 역할
            </Typography>
            {isLoading ? (
              <Skeleton variant="rounded" height={56} />
            ) : (
              <>
                <FormControl fullWidth disabled={!canEdit}>
                  <InputLabel id="default-role-label">기본 역할</InputLabel>
                  <Select
                    disabled={data?.payload?.teamTarget === SubscriptionTargetType.Individual}
                    labelId="default-role-label"
                    label="기본 역할"
                    value={teamDefaultRole}
                    onChange={(e) => setTeamDefaultRole(e.target.value as UserRole)}
                  >
                    <MenuItem value={UserRole.Viewer}>Viewer</MenuItem>
                    <MenuItem value={UserRole.Editor}>Editor</MenuItem>
                    <MenuItem value={UserRole.Admin}>Admin</MenuItem>
                    <MenuItem disabled value={UserRole.Owner}>
                      Owner
                    </MenuItem>
                  </Select>
                </FormControl>
                <Box mt={2}>
                  {true ? (
                    <Button variant="contained" disabled={!canEdit} onClick={handleDefaultRoleUpdate}>
                      {canEdit ? '저장' : '권한 없음'}
                    </Button>
                  ) : (
                    <Alert severity="info" variant="outlined">
                      팀 대상이 개인 대상이므로 초대 시 기본 부여 역할을 설정할 수 없습니다.
                    </Alert>
                  )}
                </Box>
              </>
            )}
          </CardContent>
        </Card>

        <Divider />

        {/* 응답 형식 (백로그, 비활성) */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={1}>
              설문 응답 형식
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              슬라이드 형식 또는 횡스크롤 형식을 선택할 수 있도록 준비 중입니다.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center">
              <FormControl component="fieldset" fullWidth disabled={!canEdit}>
                <Typography component="legend" variant="subtitle1" sx={{ mb: 1 }}>
                  응답 형식
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={3}>
                  {/* 라디오 버튼 */}
                  <RadioGroup
                    name="response-format"
                    value={responseFormat}
                    onChange={(event) => setResponseFormat(event.target.value as ResponseFormat)}
                  >
                    <FormControlLabel
                      value={ResponseFormat.Slide}
                      control={<Radio />}
                      label={
                        <Box>
                          <Stack direction="row" gap={1} alignItems="center">
                            <Typography variant="body1" fontWeight={500}>
                              슬라이드 형식
                            </Typography>
                            <Typography variant="caption" fontWeight={500} color="grey.500">
                              기본값
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            각 질문을 하나씩 넘기며 응답
                          </Typography>
                        </Box>
                      }
                      sx={{ mb: 1.5, mr: 0 }}
                    />
                    <FormControlLabel
                      value={ResponseFormat.Scroll}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            스크롤 형식
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            모든 질문을 한 번에 스크롤하여 응답
                          </Typography>
                        </Box>
                      }
                      sx={{ mb: 0, mr: 0 }}
                    />
                  </RadioGroup>

                  {/* 미리보기 */}
                  <Stack direction="column" gap={1} minWidth={160} width={180} minHeight={250} alignItems="stretch">
                    <Box alignSelf="center">{previewRender}</Box>
                    <Box
                      alignSelf="center"
                      bgcolor="grey.100"
                      borderRadius={1}
                      px={1.5}
                      py={0.5}
                      fontSize={13}
                      color="primary.main"
                      fontWeight={500}
                      sx={{ border: '1px solid', borderColor: 'grey.300' }}
                      textAlign="center"
                    >
                      {responseFormat === ResponseFormat.Slide ? '슬라이드 형식 선택됨' : '스크롤 형식 선택됨'}
                    </Box>
                  </Stack>
                </Stack>
              </FormControl>
            </Stack>
            <Stack direction="row" gap={1} mt={2}>
              <ActionButton variant="contained" disabled={!canEdit} onClick={handleResponseFormatUpdate}>
                {canEdit ? '저장' : '권한 없음'}
              </ActionButton>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default OrganizationSetting;
