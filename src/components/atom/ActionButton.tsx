import { ButtonProps, CircularProgress } from '@mui/material';
import CommonButton from './CommonButton';
import { useCallback, useContext } from 'react';
import { NetworkContext } from '@context/NetworkContext';
import { GlobalDialogContext } from '@context/GlobalDialogContext';

interface ActionButtonProps extends ButtonProps {
  label?: string;
  isLoading?: boolean;
}
const ActionButton: React.FC<ActionButtonProps> = ({ children, isLoading, disabled, startIcon, type, onClick, ...props }) => {
  const { isServerAlive } = useContext(NetworkContext);
  const { handleOpenDialog } = useContext(GlobalDialogContext);

  const handleOpenNetworkAlert = useCallback(() => {
    handleOpenDialog({
      type: 'warning',
      title: '서버 연결 안내',
      content: '서버와의 연결이 끊어져 요청을 처리할 수 없습니다.\n\n잠시 후 다시 시도하거나, 문제가 지속될 경우 관리자에게 문의해주세요.',
      useConfirm: false,
    });
  }, []);

  return (
    <CommonButton
      onClick={isServerAlive ? onClick : handleOpenNetworkAlert}
      {...props}
      type={!isServerAlive && type === 'submit' ? 'button' : type}
      startIcon={isLoading !== undefined ? isLoading && <CircularProgress size="inherit" color="white" /> : startIcon}
      disabled={isLoading !== undefined ? isLoading : disabled}
    >
      {children}
    </CommonButton>
  );
};

export default ActionButton;
