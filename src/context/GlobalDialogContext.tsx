'use client';

import ActionButton from '@components/atom/ActionButton';
import { CheckCircleOutline, ErrorOutline, InfoOutlined, WarningAmberOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Portal, Stack, SvgIcon, Typography } from '@mui/material';
import React, { createContext, createRef, RefObject, useCallback, useEffect, useRef, useState } from 'react';

interface GlobalDialogContextProps {
  children: React.ReactNode;
}

export type DialogType = 'success' | 'error' | 'warning' | 'info';

export interface DialogItem {
  id: string;
  type?: DialogType;
  title: string;
  content: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  actionCallback?: () => void;
  useConfirm?: boolean;
  onClose?: () => void;
}

interface GlobalDialogContextType {
  dialogs: DialogItem[];
  handleOpenDialog: ({ title, content, type, confirmText, cancelText, actionCallback, useConfirm, onClose }: Omit<DialogItem, 'id'>) => string;
  handleCloseDialog: (dialogId?: string) => void;
}

export const GlobalDialogContext = createContext<GlobalDialogContextType>({
  dialogs: [],
  handleOpenDialog: () => '',
  handleCloseDialog: () => {},
});

const GlobalDialogProvider: React.FC<GlobalDialogContextProps> = ({ children }) => {
  const [dialogs, setDialogs] = useState<DialogItem[]>([]);
  const confirmButtonRefs = useRef<{ [key: string]: RefObject<HTMLButtonElement> }>({});

  const handleOpenDialog = useCallback(
    ({
      type = 'success',
      title,
      content,
      confirmText = '확인',
      cancelText = '닫기',
      actionCallback,
      useConfirm = true,
      onClose,
    }: Omit<DialogItem, 'id'>) => {
      const generateId = () => `dialog-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const id = generateId();
      const newDialog: DialogItem = { id, type, title, content, confirmText, cancelText, actionCallback, useConfirm, onClose };

      const current = confirmButtonRefs.current;
      if (current) {
        Object.assign(current, { [id]: createRef<HTMLButtonElement>() });
      }

      setDialogs((prev) => [...prev, newDialog]);

      return id;
    },
    [],
  );

  const handleCloseDialog = useCallback((dialogId?: string) => {
    if (dialogId) {
      // 특정 다이얼로그 닫기
      setDialogs((prev) => {
        const dialog = prev.find((d) => d.id === dialogId);
        if (dialog?.onClose) {
          dialog.onClose();
        }
        delete confirmButtonRefs.current[dialogId];
        return prev.filter((d) => d.id !== dialogId);
      });
    } else {
      // 가장 최근 다이얼로그 닫기
      setDialogs((prev) => {
        if (prev.length === 0) return prev;
        const lastDialog = prev[prev.length - 1];
        if (lastDialog.onClose) {
          lastDialog.onClose();
        }
        delete confirmButtonRefs.current[lastDialog.id];
        return prev.slice(0, -1);
      });
    }
  }, []);

  const handleAction = useCallback(
    (dialog: DialogItem) => {
      if (dialog.actionCallback) {
        dialog.actionCallback();
      }
      handleCloseDialog(dialog.id);
    },
    [handleCloseDialog],
  );

  // Focus management for accessibility
  useEffect(() => {
    const lastDialog = dialogs[dialogs.length - 1];
    if (lastDialog && confirmButtonRefs.current[lastDialog.id]?.current) {
      const timer = setTimeout(() => {
        confirmButtonRefs.current[lastDialog.id]?.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [dialogs]);

  const icon = useCallback((type: DialogType) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutline />;
      case 'error':
        return <ErrorOutline />;
      case 'warning':
        return <WarningAmberOutlined />;
      case 'info':
        return <InfoOutlined />;
    }
  }, []);

  return (
    <GlobalDialogContext.Provider value={{ dialogs, handleOpenDialog, handleCloseDialog }}>
      {children}
      <Portal>
        {dialogs.map((dialog, index) => (
          <Dialog
            key={dialog.id}
            open={true}
            onClose={() => handleCloseDialog(dialog.id)}
            fullWidth
            maxWidth="sm"
            sx={{ zIndex: 10000 + index }}
            aria-labelledby={`dialog-title-${dialog.id}`}
            aria-describedby={`dialog-content-${dialog.id}`}
            disableRestoreFocus
            slotProps={{
              paper: {
                sx: {
                  p: 2,
                },
              },
            }}
          >
            <DialogTitle id={`dialog-title-${dialog.id}`}>
              <Stack direction="row" alignItems="center" gap={1}>
                <SvgIcon color={dialog.type}>{icon(dialog.type!)}</SvgIcon>
                <Typography variant="h6">{dialog.title}</Typography>
              </Stack>
            </DialogTitle>
            <DialogContent id={`dialog-content-${dialog.id}`} sx={{ whiteSpace: 'pre-wrap' }}>
              {dialog.content}
            </DialogContent>
            <DialogActions>
              <ActionButton onClick={() => handleCloseDialog(dialog.id)} color={dialog.type!} variant="outlined">
                {dialog.cancelText ?? '닫기'}
              </ActionButton>
              {dialog.useConfirm && (
                <ActionButton
                  ref={confirmButtonRefs.current[dialog.id]}
                  onClick={() => handleAction(dialog)}
                  color={dialog.type!}
                  variant="contained"
                >
                  {dialog.confirmText ?? '확인'}
                </ActionButton>
              )}
            </DialogActions>
          </Dialog>
        ))}
      </Portal>
    </GlobalDialogContext.Provider>
  );
};

export default GlobalDialogProvider;
