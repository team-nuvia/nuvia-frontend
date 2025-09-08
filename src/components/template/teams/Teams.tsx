'use client';

import { getOrganizationRoles } from '@api/get-organization-roles';
import { getUserOrganizations } from '@api/get-user-organizations';
import { updateOrganizationRole } from '@api/update-organization-role';
import CommonText from '@components/atom/CommonText';
import Loading from '@components/atom/Loading';
import InviteDialog from '@components/template/teams/InviteDialog';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import { useLoading } from '@hooks/useLoading';
import { Add, Group, Settings } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Card, MenuItem, Paper, Select, SelectChangeEvent, Stack, Tab, Tabs, Typography } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  useGridApiRef,
} from '@mui/x-data-grid';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { PlanNameType } from '@share/enums/plan-name-type.enum';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { UserRole, UserRoleList } from '@share/enums/user-role';
import { useMutation, useQuery } from '@tanstack/react-query';
import { capitalize } from '@util/capitalize';
import { DateFormat } from '@util/dateFormat';
import { LocalizationManager } from '@util/LocalizationManager';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { SyntheticEvent, useCallback, useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import PlanUpgradeModal from './PlanUpgradeModal';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`team-tabpanel-${index}`} aria-labelledby={`team-tab-${index}`} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const validationSchema = Yup.object().shape({
  organizationRoleId: Yup.number().required('필수 입력 항목입니다.'),
  role: Yup.string().required('권한을 선택해주세요.'),
  status: Yup.string().required('상태를 선택해주세요.'),
});

const Teams = () => {
  useLoading({ forUser: true, unverifiedRoute: '/auth/login' });
  const { user, mainUrl } = useContext(AuthenticationContext);
  const router = useRouter();
  const { addNotice } = useContext(GlobalSnackbarContext);
  const { handleOpenDialog } = useContext(GlobalDialogContext);
  const [tabValue, setTabValue] = useState(0);
  const { data: organizationData, isLoading: isOrganizationLoading } = useQuery({
    queryKey: ['user-organizations'],
    queryFn: getUserOrganizations,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  });
  const organizationPayload = organizationData?.payload;
  const currentOrganization = organizationPayload?.currentOrganization;
  const apiRef = useGridApiRef();
  const updatedRow = useCallback(
    (id: GridRowId) => {
      if (!apiRef.current) return null;
      const updatedRoleRow = apiRef.current.getRowWithUpdatedValues(id, 'role');
      const updatedStatusRow = apiRef.current.getRowWithUpdatedValues(id, 'status');
      const updatedData = {
        organizationRoleId: id,
        status: updatedStatusRow?.status,
        role: updatedRoleRow?.role,
      };
      return updatedData;
    },
    [apiRef],
  );
  const {
    data: organizationRoles,
    isLoading: isOrganizationRolesLoading,
    refetch: refetchOrganizationRoles,
  } = useQuery({
    queryKey: ['organization-roles', currentOrganization?.id],
    queryFn: () => getOrganizationRoles(currentOrganization!.id),
    enabled: !!currentOrganization?.id,
  });
  const { mutate: updateOrganizationRoleMutate } = useMutation({
    mutationFn: ({
      subscriptionId,
      organizationRoleId,
      role,
      status,
    }: {
      subscriptionId: number;
      organizationRoleId: number;
      role: string;
      status: string;
    }) => updateOrganizationRole(subscriptionId, organizationRoleId, { role, status }),
    onSuccess: (data) => {
      addNotice(data.message ?? '설정이 변경되었습니다.', 'success');
      refetchOrganizationRoles();
      formik.setFieldValue('organizationRoleId', 0);
      formik.setFieldValue('role', '');
      formik.setFieldValue('status', true);
    },
    onError: (error: AxiosError<ServerResponse<null>>) => {
      formik.setFieldValue('organizationRoleId', 0);
      formik.setFieldValue('role', '');
      formik.setFieldValue('status', true);
      addNotice((error.response?.data?.reason as string) ?? error.response?.data?.message ?? '설정 변경에 실패하였습니다.', 'error');
    },
  });
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const formik = useFormik<{ organizationRoleId: number; role: string; status: string }>({
    initialValues: {
      organizationRoleId: 0,
      role: '',
      status: '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (user?.currentOrganization && currentOrganization) {
        updateOrganizationRoleMutate({
          subscriptionId: user.currentOrganization.id,
          organizationRoleId: values.organizationRoleId,
          role: values.role,
          status: values.status,
        });
      }
    },
  });
  const isOrganization = currentOrganization?.target === SubscriptionTargetType.Organization;

  // 더미 팀원 데이터 (실제로는 API에서 가져와야 함)
  const teamMembers: GridRowsProp = organizationRoles?.payload ?? [];

  const isMyData = (id: GridRowId) => {
    return teamMembers.find((member) => member.id === id)?.id === user?.currentOrganization?.organizationId;
  };

  const isOwner = (id: GridRowId) => {
    return teamMembers.find((member) => member.id === id)?.role === UserRole.Owner;
  };

  const isViewer = user?.role === UserRole.Viewer;

  useEffect(() => {
    if (!isOrganization) {
      router.push(mainUrl);
    }
  }, [currentOrganization]);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenInviteDialog = () => {
    if (!currentOrganization?.id) return;

    // 초대 한도 체크
    const maxInvites = currentOrganization?.plan.name === PlanNameType.Premium ? 30 : 10;
    if (teamMembers.length >= maxInvites) {
      handleOpenPlanUpgradeModal();
      return;
    }

    handleOpenDialog({
      title: '팀원 초대',
      content: <InviteDialog subscriptionId={currentOrganization.id} />,
      useConfirm: false,
    });
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    if (!apiRef.current) return;
    const updatedRowData = updatedRow(id);
    if (updatedRowData) {
      formik.setFieldValue('organizationRoleId', updatedRowData.organizationRoleId);
      formik.setFieldValue('role', updatedRowData.role);
      formik.setFieldValue('status', updatedRowData.status);
      await formik.submitForm();
    }
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    console.log('삭제:', id);
    // delete api
    // setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  /* 실제 업데이트 데이터 반환 */
  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    return { ...newRow };
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  /* 플랜 업그레이드 유도 모달 */
  const handleOpenPlanUpgradeModal = () => {
    handleOpenDialog({
      title: '플랜 업그레이드',
      content: <PlanUpgradeModal />,
      useConfirm: false,
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: '이름',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <CommonText component="span" thickness="medium" fontSize={14}>
          {params.value}
        </CommonText>
      ),
    },
    {
      field: 'email',
      headerName: '이메일',
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <Typography component="a" href={`mailto:${params.value}`} fontSize={14} color="text.secondary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'role',
      headerName: '권한',
      editable: true,
      type: 'singleSelect',
      valueOptions: UserRoleList,
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <CommonText
          component="span"
          thickness="medium"
          fontSize={12}
          color={
            params.value === UserRole.Owner
              ? 'error'
              : params.value === UserRole.Admin
              ? 'primary'
              : params.value === UserRole.Editor
              ? 'success'
              : 'textSecondary'
          }
        >
          {capitalize(params.value as string)}
        </CommonText>
      ),
    },
    {
      field: 'status',
      headerName: '상태',
      type: 'custom',
      editable: true,
      flex: 0.8,
      minWidth: 80,
      renderEditCell: (params) => {
        return (
          <Stack alignItems="center" justifyContent="center" width="100%" spacing={1}>
            {/* <IOSSwitch
              size="small"
              checked={params.value}
              onChange={(event, newValue: boolean) => {
                apiRef.current?.setEditCellValue({ id: params.id, field: 'status', value: newValue });
              }}
            /> */}
            <Select
              value={params.value}
              onChange={(event: SelectChangeEvent<string>) => {
                apiRef.current?.setEditCellValue({ id: params.id, field: 'status', value: event.target.value });
              }}
            >
              <MenuItem value={OrganizationRoleStatusType.Invited}>{LocalizationManager.translate(OrganizationRoleStatusType.Invited)}</MenuItem>
              <MenuItem value={OrganizationRoleStatusType.Joined}>{LocalizationManager.translate(OrganizationRoleStatusType.Joined)}</MenuItem>
              <MenuItem value={OrganizationRoleStatusType.Deactivated}>
                {LocalizationManager.translate(OrganizationRoleStatusType.Deactivated)}
              </MenuItem>
            </Select>
          </Stack>
        );
      },
      renderCell: (params) => (
        <CommonText component="span" thickness="medium" fontSize={12} color={params.value ? 'success.main' : 'error.main'}>
          {LocalizationManager.translate(params.value)}
        </CommonText>
      ),
    },
    {
      field: 'joinDate',
      headerName: '가입일',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <CommonText component="span" thickness="regular" fontSize={14} color="text.secondary">
          {DateFormat.toUTC('YYYY. MM. dd', params.value)}
        </CommonText>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '작업',
      flex: 0,
      minWidth: 80,
      sortable: false,
      getActions: ({ id }: { id: GridRowId }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isMyData(id) || isOwner(id) || isViewer) {
          return [];
        }

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<SaveIcon />}
              label="Save"
              material={{
                sx: {
                  color: 'primary.main',
                },
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={id}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem key={id} icon={<EditIcon />} label="Edit" className="textPrimary" onClick={handleEditClick(id)} color="inherit" />,
          <GridActionsCellItem key={id} icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} color="inherit" />,
        ];
      },
    },
  ];

  if (isOrganizationLoading) {
    return <Loading />;
  }

  return (
    <Stack sx={{ py: 4, px: 3 }}>
      {/* 헤더 */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        sx={{ mb: 4, gap: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Group sx={{ fontSize: 32, color: 'primary.main' }} />
          <Stack>
            <CommonText variant="h4" thickness="bold">
              팀 관리
            </CommonText>
            <CommonText variant="body2" color="text.secondary">
              {currentOrganization?.name} 팀원들을 관리하세요
            </CommonText>
            {/* 플랜 정보 및 초대 가능 인원 표시 */}
            {isOrganization && (
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                <CommonText variant="caption" color="text.secondary">
                  현재 플랜:
                </CommonText>
                <CommonText
                  variant="caption"
                  thickness="medium"
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: currentOrganization?.plan.name === PlanNameType.Premium ? 'primary.50' : 'grey.100',
                    color: currentOrganization?.plan.name === PlanNameType.Premium ? 'primary.main' : 'text.secondary',
                    border: '1px solid',
                    borderColor: currentOrganization?.plan.name === PlanNameType.Premium ? 'primary.200' : 'grey.300',
                  }}
                >
                  {currentOrganization?.plan.name ?? PlanNameType.Basic}
                </CommonText>
                <CommonText variant="caption" color="text.secondary">
                  • 초대 가능:
                </CommonText>
                <CommonText
                  variant="caption"
                  thickness="medium"
                  color={teamMembers.length >= (currentOrganization?.plan.name === PlanNameType.Premium ? 30 : 10) ? 'error.main' : 'success.main'}
                >
                  {teamMembers.length} / {currentOrganization?.plan.name === PlanNameType.Premium ? '30' : '10'}명
                </CommonText>
                {/* 초대 한도 도달 시 안내 */}
                {teamMembers.length >= (currentOrganization?.plan.name === PlanNameType.Premium ? 30 : 10) && (
                  <CommonText
                    variant="caption"
                    color="error.main"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: 'error.50',
                      border: '1px solid',
                      borderColor: 'error.200',
                    }}
                  >
                    한도 도달
                  </CommonText>
                )}
              </Stack>
            )}
          </Stack>
        </Stack>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={isOrganization ? handleOpenInviteDialog : handleOpenPlanUpgradeModal}
          disabled={isOrganization && teamMembers.length >= (currentOrganization?.plan.name === PlanNameType.Premium ? 30 : 10)}
          sx={{ px: 3 }}
        >
          {isOrganization && teamMembers.length >= (currentOrganization?.plan.name === PlanNameType.Premium ? 30 : 10)
            ? '초대 한도 도달'
            : '팀원 초대'}
        </Button>
      </Stack>

      {/* 탭 네비게이션 */}
      <Paper elevation={1} sx={{ mb: 3, overflow: 'hidden' }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2 }}>
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Group sx={{ fontSize: 20 }} />
                <CommonText thickness="medium">팀원 목록</CommonText>
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Settings sx={{ fontSize: 20 }} />
                <CommonText thickness="medium">팀 설정</CommonText>
              </Stack>
            }
          />
        </Tabs>
      </Paper>

      {/* 탭 패널 */}
      <TabPanel value={tabValue} index={0}>
        <Card elevation={1} sx={{ overflow: 'hidden' }}>
          <Paper>
            <DataGrid
              apiRef={apiRef}
              loading={isOrganizationRolesLoading}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 15]}
              rows={teamMembers}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              processRowUpdate={processRowUpdate}
              onRowEditStop={handleRowEditStop}
              disableRowSelectionOnClick
              isCellEditable={(params) => {
                return !isMyData(params.id) && !isOwner(params.id) && !isViewer;
              }}
              sx={{
                backgroundColor: 'background.paper',
                border: 'none',
                '& .MuiDataGrid-cell': {
                  border: 'none',
                },
                '& .MuiDataGrid-columnHeader': {
                  border: 'none',
                },
              }}
            />
          </Paper>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card elevation={1} sx={{ p: 3 }}>
          <Stack spacing={3}>
            <CommonText variant="h6" thickness="bold">
              팀 설정
            </CommonText>
            <CommonText variant="body2" color="text.secondary">
              팀 설정 기능은 추후 구현 예정입니다.
            </CommonText>
          </Stack>
        </Card>
      </TabPanel>
    </Stack>
  );
};

export default Teams;
