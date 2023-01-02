import {
  Autocomplete,
  Box,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { createRef, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Iconify from '../../../components/Iconify';
import QuestionClientItem from './QuestionClientItem';
import useAuth from '../../../hooks/useAuth';

QuestionBoxClientContent.propTypes = {
  questionList: PropTypes.array,
  onSendQuestion: PropTypes.func
};

const ALL = 'ALL';
const ANSWERED = 'ANSWERED';
const NANSWERED = 'NOT_ANSWERED';
const options = {
  all: ALL,
  answered: ANSWERED,
  not_answered: NANSWERED
};

export default function QuestionBoxClientContent({
  questionList,
  onSendQuestion
}) {
  const [questionInput, setQuestionInput] = useState('');
  const { user } = useAuth();
  const ref = useRef(null);
  const [scroll2Bottom, setScroll2Bottom] = useState(false);
  const [inputFilter, setInputFilter] = useState(options.all);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    console.log(questionList);
    setQuestions(questionList);
    if (scroll2Bottom && ref.current) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // window.scrollBy(0, 10);
      setScroll2Bottom(false);
    }
    handleFilterQuestions(inputFilter);
  }, [questionList]);

  const onInputChange = (evt) => {
    setQuestionInput(evt.target.value);
  };
  const handleSendQuestion = () => {
    if (questionInput.trim() !== '') {
      const fullname = user ? `${user.firstName} ${user.lastName}` : null;
      const email = user ? user.email : null;
      onSendQuestion({
        id: uuid(),
        content: questionInput,
        author: fullname,
        email,
        isAnswered: false,
        createdAt: Date.now()
      });
      setQuestionInput('');
      setScroll2Bottom(true);
    } else {
      /* empty */
    }
  };

  const onKeyPress = (evt) => {
    if (evt.keyCode === 13) {
      handleSendQuestion();
    }
  };

  const onChangeFilter = (evt) => {
    const filter = evt.target.value;
    setInputFilter(filter);
    handleFilterQuestions(filter);
  };

  const handleFilterQuestions = (filter) => {
    switch (filter) {
      case options.answered:
        setQuestions(questionList.filter((question) => question.isAnswered));
        break;
      case options.not_answered:
        setQuestions(questionList.filter((question) => !question.isAnswered));
        break;
      default:
        setQuestions(questionList);
    }
  };

  return (
    <DialogContent
      sx={{
        overflow: 'hidden',
        width: '100%'
      }}
    >
      <Stack
        sx={{
          width: '100%',
          height: 500
        }}
        spacing={1}
        mt={2}
      >
        <FormControl fullWidth>
          <Select
            id="demo-simple-select"
            value={inputFilter}
            displayEmpty
            onChange={onChangeFilter}
          >
            <MenuItem value={options.all}>All</MenuItem>
            <MenuItem value={options.answered}>Questions Answered</MenuItem>
            <MenuItem value={options.not_answered}>
              Questions Not Answered
            </MenuItem>
          </Select>
        </FormControl>
        <Stack flex={1} spacing={2} overflow="auto">
          {questions.map((question) => {
            return <QuestionClientItem key={question.id} question={question} />;
          })}
          <Box ref={ref} />
        </Stack>
        <Stack sx={{ flex: '0 0 auto' }} direction="row">
          <TextField
            value={questionInput}
            onChange={onInputChange}
            onKeyDown={onKeyPress}
            fullWidth
            flex={1}
            variant="outlined"
          />
          <IconButton onClick={handleSendQuestion}>
            <Iconify icon="material-symbols:send-rounded" />
          </IconButton>
        </Stack>
      </Stack>
    </DialogContent>
  );
}
