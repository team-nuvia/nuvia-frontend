import CommonText from '@components/atom/CommonText';
import IncreaseNumber from '@components/atom/IncreaseNumber';
import { Stack } from '@mui/material';
import { useMemo } from 'react';

interface StatisticsCardProps {
  title: string | number;
  description: string;
  action?: React.ReactNode;
}
const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  description,
  action,
}) => {
  const memoizedTitle = useMemo(() => {
    if (typeof title === 'string') {
      return (
        <CommonText variant="h6" color="textPrimary" thickness="bold">
          {title}
        </CommonText>
      );
    }
    if (typeof title === 'number') {
      return <IncreaseNumber content={title} />;
    }
    return title;
  }, [title]);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      flex={1}
      sx={{
        p: 3,
        borderWidth: 1,
        borderColor: (theme) => theme.palette.divider,
        borderStyle: 'solid',
        background: (theme) => theme.palette.background.paper,
        borderRadius: 3,
      }}
    >
      <Stack>
        {memoizedTitle}
        <CommonText variant="body1" color="textSecondary">
          {description}
        </CommonText>
      </Stack>
      {action && <Stack direction="row">{action}</Stack>}
    </Stack>
  );
};

export default StatisticsCard;
