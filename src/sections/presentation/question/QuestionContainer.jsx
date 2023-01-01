import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Iconify from '../../../components/Iconify';

QuestionContainer.propTypes = {
  questions: PropTypes.array,
  onUpdateQuestion: PropTypes.func
};
export default function QuestionContainer({ questions, onUpdateQuestion }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [disablePrev, setDisablePrev] = useState(false);
  const [disableNext, setDisableNext] = useState(false);
  const [questionList, setQuestionList] = useState([]);

  useEffect(() => {
    setDisableNext(currentIndex + 1 >= questionList.length);
    setDisablePrev(currentIndex <= 0);
  }, [currentIndex, questionList]);

  useEffect(() => {
    console.log(questions);
    setQuestionList(questions);
  }, [questions]);
  const onPrevButtonClick = () => {
    if (currentIndex - 1 < 0) {
      return;
    }
    setCurrentIndex(currentIndex - 1);
  };

  const onNextButtonClick = () => {
    if (currentIndex + 1 >= questionList.length) {
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const onAnswerButtonClick = (question) => {
    const newQuestions = questionList.map((prevQuestion) => {
      if (prevQuestion.id === question.id) {
        const isAnswered = !prevQuestion.isAnswered;
        const updatedQuestion = { ...prevQuestion, isAnswered };
        onUpdateQuestion(updatedQuestion);
        return { ...prevQuestion, isAnswered };
      }
      return prevQuestion;
    });
    setQuestionList(newQuestions);
  };

  return (
    <Box
      sx={{
        width: 500,
        height: 300
      }}
    >
      {questionList && questionList.length && (
        <Stack sx={{ height: '100%' }}>
          <Typography align="center">
            {' '}
            {currentIndex + 1} / {questionList.length}{' '}
          </Typography>
          <Stack sx={{ height: '100%' }} direction="row" alignItems="center">
            <IconButton onClick={onPrevButtonClick} disabled={disablePrev}>
              <Iconify icon="ooui:previous-ltr" />
            </IconButton>
            <Typography
              variant="h5"
              sx={{ overflowX: 'hidden' }}
              maxHeight={150}
              overflow="auto"
              align="center"
              color="black"
              paragraph
              flex={1}
            >
              {questionList[currentIndex].content
                ? questionList[currentIndex].content
                : ''}
            </Typography>
            <IconButton onClick={onNextButtonClick} disabled={disableNext}>
              <Iconify icon="ooui:previous-rtl" />
            </IconButton>
          </Stack>
          <Typography align="center" paragraph>
            -{' '}
            {questionList[currentIndex].author
              ? questionList[currentIndex].author
              : 'anonymous'}{' '}
            -
          </Typography>
          <Button
            onClick={() => onAnswerButtonClick(questionList[currentIndex])}
            color="primary"
            sx={{ borderRadius: 28 }}
            variant={
              questionList[currentIndex].isAnswered ? 'contained' : 'outlined'
            }
          >
            {questionList[currentIndex].isAnswered ? 'Answered' : 'Answer'}
          </Button>
        </Stack>
      )}
    </Box>
  );
}
