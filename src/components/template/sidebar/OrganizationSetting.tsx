'use client';

import { useAuthStore } from '@/store/auth.store';
import queryKeys from '@/store/lib/query-key';
import { getOrganizationSettings } from '@api/organization/get-organization-settings';
import { UserRole } from '@share/enums/user-role';
import { roleAtLeast } from '@util/roleAtLeast';
import { Alert, Box, Button, Card, CardContent, Container, Divider, FormControl, InputLabel, MenuItem, Select, Skeleton, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

interface OrganizationSettingProps {}
const OrganizationSetting: React.FC<OrganizationSettingProps> = () => {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.organization.settings(),
    queryFn: getOrganizationSettings,
    enabled: !!user,
  });

  const canEdit = roleAtLeast(UserRole.Admin, user?.currentOrganization?.role);

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
            이 페이지는 보기 전용입니다. 변경은 관리자 이상만 할 수 있습니다.
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
                defaultValue={data?.payload?.teamName ?? ''}
                disabled={!canEdit}
                fullWidth
              />
              <TextField
                label="팀 설명"
                placeholder="팀 설명을 입력하세요"
                defaultValue={data?.payload?.teamDescription ?? ''}
                disabled={!canEdit}
                fullWidth
                multiline
                minRows={3}
              />
              <Box>
                <Button variant="contained" disabled>{canEdit ? '저장 (API 연결 대기)' : '권한 없음'}</Button>
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
                  labelId="default-role-label"
                  label="기본 역할"
                  defaultValue={data?.payload?.teamDefaultRole ?? UserRole.Viewer}
                >
                  <MenuItem value={UserRole.Viewer}>Viewer</MenuItem>
                  <MenuItem value={UserRole.Editor}>Editor</MenuItem>
                  <MenuItem value={UserRole.Admin}>Admin</MenuItem>
                </Select>
              </FormControl>
              <Box mt={2}>
                <Button variant="contained" disabled>{canEdit ? '저장 (API 연결 대기)' : '권한 없음'}</Button>
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
            설문 응답 형식 (백로그)
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            슬라이드 형식 또는 횡스크롤 형식을 선택할 수 있도록 준비 중입니다.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center">
            <Tooltip title="백로그 기능입니다. 추후 제공 예정" placement="top" arrow>
              <span>
                <FormControl fullWidth disabled>
                  <InputLabel id="response-format-label">응답 형식</InputLabel>
                  <Select labelId="response-format-label" label="응답 형식" defaultValue="slide">
                    <MenuItem value="slide">슬라이드 형식</MenuItem>
                    <MenuItem value="horizontal">횡스크롤 형식</MenuItem>
                  </Select>
                </FormControl>
              </span>
            </Tooltip>
            <Tooltip title="백로그 기능입니다. 추후 제공 예정" placement="top" arrow>
              <span>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Switch disabled />
                  <Typography variant="body2" color="text.secondary">미리보기</Typography>
                </Stack>
              </span>
            </Tooltip>
          </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default OrganizationSetting;
