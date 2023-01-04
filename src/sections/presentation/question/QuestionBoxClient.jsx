import { Dialog, DialogTitle, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Iconify from '../../../components/Iconify';
import QuestionBoxClientContent from './QuestionBoxClientContent';
import { _questions } from '../../../_mock';

QuestionBoxClient.propTypes = {
  questions: PropTypes.array,
  onSendQuestion: PropTypes.func,
  onVoteButtonClick: PropTypes.func
};
export default function QuestionBoxClient({
  questions,
  onSendQuestion,
  onVoteButtonClick
}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleSendQuestion = (data) => {
    onSendQuestion(data);
    // add question to list
  };

  const handleVoteButtonClick = (question) => {
    onVoteButtonClick(question);
  };

  return (
    <>
      <IconButton
        onClick={handleClickOpen}
        color="primary"
        aria-label="upload picture"
        component="label"
      >
        <Iconify icon="mdi:message-question-outline" />
      </IconButton>
      <Dialog fullWidth={true} open={open}>
        <DialogTitle variant="h4" sx={{ m: 0, p: 2 }}>
          Questions from audience
          {onClose ? (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500]
              }}
            >
              <Iconify icon="material-symbols:close-rounded" />
            </IconButton>
          ) : null}
        </DialogTitle>
        <QuestionBoxClientContent
          onSendQuestion={handleSendQuestion}
          questionList={questions}
          onVoteButtonClick={handleVoteButtonClick}
        />
      </Dialog>
    </>
  );
}
