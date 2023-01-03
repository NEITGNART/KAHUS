import {
  Autocomplete,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';

QuestionClientItem.propTypes = {
  question: PropTypes.object,
  onVoteButtonClick: PropTypes.func
};
export default function QuestionClientItem({ question, onVoteButtonClick }) {
  const { user } = useAuth();

  let author;
  let isMe = false;
  if (question && user && question.email && question.email === user.email) {
    author = 'Me';
    isMe = true;
  } else {
    author = question.author ? question.author : 'anonymous';
    isMe = false;
  }

  const handleVoteButtonClick = () => {
    onVoteButtonClick();
  };
  return (
    <>
      <Stack>
        <Stack justifyContent="space-between" direction="row">
          <div>
            <Chip
              sx={{ maxWidth: '200px' }}
              label={author}
              color={isMe ? 'primary' : 'default'}
              size="small"
            />
            <Typography mr={1} variant="subtitle2">
              {question.content}
              {question.isAnswered && (
                <Typography variant="subtitle2" color="green">
                  {' '}
                  Answered
                </Typography>
              )}
            </Typography>
            {question.createdAt && (
              <Typography variant="caption">
                {moment(question.createdAt).startOf('hour').calendar()}
              </Typography>
            )}
          </div>
          <Stack alignSelf="flex-start" alignItems="center" mr={1}>
            <Button variant="outlined" onClick={handleVoteButtonClick}>
              <ThumbUpOffAltOutlinedIcon />
            </Button>
            <Typography>0</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Divider variant="inset" />
    </>
  );
}
