'use client';

import ActionButton from '@components/atom/ActionButton';
import { Dialog, DialogActions, DialogContent, DialogTitle, Portal, Typography } from '@mui/material';
import { createContext, useEffect, useRef, useState } from 'react';

interface GlobalDialogContextProps {
  children: React.ReactNode;
}

interface GlobalDialogContextType {
  open: boolean;
  handleCloseDialog: () => void;
  handleOpenDialog: (title: string, content: string | React.ReactNode, actionCallback?: () => void) => void;
}

export const GlobalDialogContext = createContext<GlobalDialogContextType>({
  open: false,
  handleCloseDialog: () => {},
  handleOpenDialog: () => {},
});

const GlobalDialogProvider: React.FC<GlobalDialogContextProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<string | React.ReactNode>('');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleAction = () => {
    confirmAction?.();
    handleCloseDialog();
  };

  const handleOpenDialog = (title: string, content: string | React.ReactNode, actionCallback?: () => void) => {
    setTitle(title);
    setContent(content);
    setConfirmAction(() => actionCallback || (() => {}));
    handleOpen();
  };

  const handleCloseDialog = () => {
    handleClose();
    setConfirmAction(() => () => {});
  };

  // Focus management for accessibility
  useEffect(() => {
    if (open && confirmButtonRef.current) {
      // Small delay to ensure dialog is fully rendered
      const timer = setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <GlobalDialogContext.Provider value={{ open, handleOpenDialog, handleCloseDialog }}>
      {children}
      <Portal>
        <Dialog
          open={open}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
          sx={{ zIndex: 10000 }}
          aria-labelledby="dialog-title"
          aria-describedby="dialog-content"
          disableRestoreFocus
          keepMounted={false}
        >
          <DialogTitle id="dialog-title">
            <Typography variant="h6">{title}</Typography>
          </DialogTitle>
          <DialogContent id="dialog-content" sx={{ whiteSpace: 'pre-wrap' }}>
            {content}
          </DialogContent>
          <DialogActions>
            <ActionButton onClick={handleCloseDialog}>닫기</ActionButton>
            <ActionButton ref={confirmButtonRef} onClick={handleAction}>
              확인
            </ActionButton>
          </DialogActions>
        </Dialog>
      </Portal>
    </GlobalDialogContext.Provider>
  );
};

export default GlobalDialogProvider;
