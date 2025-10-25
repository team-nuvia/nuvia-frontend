import { Stack, TextField, TextFieldProps, Typography } from '@mui/material';

type LimitTextFieldProps = Omit<TextFieldProps, 'inputProps'> & {
  maxLength: number;
  value?: string;
  resizeY?: boolean;
  resizeX?: boolean;
};

const LimitTextField = ({ maxLength, value, sx, resizeY = false, resizeX = false, ...props }: LimitTextFieldProps) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      sx={{
        position: 'relative',
        ...(props.multiline && {
          ['& .MuiInputBase-input']: {
            resize: props.disabled ? 'none' : resizeY ? 'vertical' : resizeX ? 'horizontal' : 'none',
            minHeight: props.disabled ? undefined : resizeY ? 25 : undefined,
          },
        }),
      }}
    >
      <TextField
        {...props}
        sx={{
          ...sx,
          '& .MuiInputBase-root': {
            p: props.disabled ? undefined : resizeX || resizeY ? 1 : undefined,
          },
        }}
        fullWidth
        value={value}
        slotProps={{
          htmlInput: { maxLength },
        }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          position: 'absolute',
          right: 12,
          bottom: props.multiline ? 12 : '50%',
          transform: props.multiline ? 'none' : 'translateY(50%)',
          userSelect: 'none',
          pointerEvents: 'none',
          color: props.disabled ? 'text.disabled' : 'text.secondary',
        }}
      >
        {value?.length || 0}/{maxLength}
      </Typography>
    </Stack>
  );
};

export default LimitTextField;
