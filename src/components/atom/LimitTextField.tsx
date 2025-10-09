import { Stack, TextField, TextFieldProps, Typography } from '@mui/material';

type LimitTextFieldProps = Omit<TextFieldProps, 'inputProps'> & {
  maxLength: number;
  value?: string;
};

const LimitTextField = ({ maxLength, value, ...props }: LimitTextFieldProps) => {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <TextField
        {...props}
        fullWidth
        value={value}
        slotProps={{
          htmlInput: { maxLength },
          input: {
            endAdornment: (
              <Typography variant="body2" color="textSecondary">
                {value?.length}/{maxLength}
              </Typography>
            ),
          },
        }}
      />
    </Stack>
  );
};

export default LimitTextField;
