import CommonText from '@components/atom/CommonText';
import IOSSwitch from '@components/atom/IOSSwitch';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';

interface SettingItemProps {
  title: string;
  description: string;
  checked: boolean;
  onSubmit: (checked: boolean) => void;
}
const SettingItem: React.FC<SettingItemProps> = ({ title, description, checked: initialChecked, onSubmit }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    onSubmit(event.target.checked);
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" gap={10}>
      <Stack>
        <CommonText variant="h6" gutterBottom>
          {title}
        </CommonText>
        <CommonText variant="body2">{description}</CommonText>
      </Stack>
      <IOSSwitch checked={checked} onChange={handleChange} color="primary" size="small" />
    </Stack>
  );
};

export default SettingItem;
