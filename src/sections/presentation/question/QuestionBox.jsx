import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import Iconify from '../../../components/Iconify';
import QuestionContainer from './QuestionContainer';
import { _questions } from '../../../_mock';
import socket from '../../../utils/socket';

const QuestionDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    // padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    // padding: theme.spacing(1)
  }
}));

QuestionDialogTitle.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.node
};

function QuestionDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
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
  );
}

QuestionBox.propTypes = {
  questions: PropTypes.array,
  onUpdateQuestion: PropTypes.func
};

export default function QuestionBox({ questions, onUpdateQuestion }) {
  const [open, setOpen] = useState(false);
  const [questionList, setQuestionList] = useState([]);

  useEffect(() => {
    setQuestionList(questions);
  }, [questions]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateQuestion = (question) => {
    onUpdateQuestion(question);
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
      <QuestionDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="question-dialog-title"
      >
        <QuestionDialogTitle id="question-dialog-title" onClose={handleClose} />
        <DialogContent
          sx={{
            overflow: 'hidden',
            maxWidth: 'fit-content'
          }}
        >
          <QuestionContainer
            questions={questionList}
            onUpdateQuestion={handleUpdateQuestion}
          />
        </DialogContent>
      </QuestionDialog>
    </>
  );
}
