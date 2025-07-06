import CommonText from '@components/atom/CommonText';
import ResponseSurvey from '@components/template/ResponseSurvey';
import CloseIcon from '@mui/icons-material/Close';
import { Container, IconButton, Paper, Stack } from '@mui/material';
import { IResponseSurvey } from '@share/dto/response-survey';

interface PreviewProps {
  survey: IResponseSurvey;
  handleClose: () => void;
}
const Preview: React.FC<PreviewProps> = ({ survey, handleClose }) => {
  return (
    <Paper
      sx={{
        p: 2,
        mt: 2,
        position: 'fixed',
        top: 15,
        left: 15,
        right: 15,
        bottom: 15,
        zIndex: 1000,
        overflow: 'auto',
      }}
    >
      <Container>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <CommonText variant="h3">미리보기</CommonText>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <ResponseSurvey survey={survey} />
      </Container>
    </Paper>
  );
};

export default Preview;
