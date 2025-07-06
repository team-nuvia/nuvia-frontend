import CommonText from '@components/atom/CommonText';
import { Container, IconButton, Paper, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ISurvey } from '@share/interface/isurvey';
import QuestionCard from '@components/organism/QuestionCard';

interface PreviewProps {
  survey: ISurvey;
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
      }}
    >
      <Container>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <CommonText variant="h6">미리보기</CommonText>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack>
          <CommonText variant="h6">{survey.title}</CommonText>
          <CommonText variant="body1">{survey.description}</CommonText>
        </Stack>
        <Stack>
          {survey.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              id={question.id}
              index={index + 1}
              title={question.title}
              description={question.description}
              questionType={question.questionType}
              dataType={question.dataType}
              required={question.required}
              options={question.options}
              handleQuestionChange={() => {}}
              handleOptionChange={() => {}}
              handleRemoveOption={() => {}}
              handleAddOption={() => {}}
              handleRemoveQuestion={() => {}}
            />
          ))}
        </Stack>
      </Container>
    </Paper>
  );
};

export default Preview;
