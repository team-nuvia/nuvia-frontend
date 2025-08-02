import CommonText from '@components/atom/CommonText';
import { LinearProgress, Stack } from '@mui/material';

interface SurveyProgressProps {
  progress: number;
}
const SurveyProgress: React.FC<SurveyProgressProps> = ({ progress = 0 }) => {
  return (
    <Stack role="progressbar" aria-label={`${progress}%`} aria-valuenow={progress} aria-labelledby="progress-label">
      <Stack direction="row" justifyContent="space-between">
        <CommonText>진행률</CommonText>
        <CommonText>{progress}%</CommonText>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 10,
          borderRadius: 10,
          backgroundColor: 'grey.300',
          '.MuiLinearProgress-bar': {
            transition: '0.3s ease-in-out',
          },
        }}
        aria-label="progress-bar"
      />
    </Stack>
  );
};

export default SurveyProgress;
