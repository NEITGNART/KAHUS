import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import Iconify from './Iconify';
import QuestionContainer from './QuestionContainer';
import { _questions } from '../_mock/_question';

const QuestionDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    // padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    // padding: theme.spacing(1)
  }
}));

QuestionDialogTitle.propTypes = {
  children: PropTypes.object,
  onClose: PropTypes.func
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
  questions: PropTypes.array
};

export default function QuestionBox({ questions }) {
  const [open, setOpen] = useState(false);

  // TODO change to real data
  questions = _questions;
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
          <QuestionContainer questions={questions} />
        </DialogContent>
      </QuestionDialog>
    </>
  );
}
