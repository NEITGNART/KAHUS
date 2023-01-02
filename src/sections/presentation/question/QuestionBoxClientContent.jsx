import {
  Box,
  DialogContent,
  IconButton,
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
  questions: PropTypes.array,
  onSendQuestion: PropTypes.func
};
export default function QuestionBoxClientContent({
  questions,
  onSendQuestion
}) {
  const [questionInput, setQuestionInput] = useState('');
  const { user } = useAuth();
  const ref = useRef(null);
  const [scroll2Bottom, setScroll2Bottom] = useState(false);

  useEffect(() => {
    if (scroll2Bottom && ref.current) {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
      setScroll2Bottom(false);
    }
  }, [questions]);

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
        isAnswered: false
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
          height: 300
        }}
        spacing={1}
      >
        <Stack flex={1} spacing={2} overflow="auto">
          {questions &&
            questions.map((question) => {
              return (
                <QuestionClientItem
                  ref={ref}
                  key={question.id}
                  question={question}
                />
              );
            })}
          <div ref={ref} />
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
